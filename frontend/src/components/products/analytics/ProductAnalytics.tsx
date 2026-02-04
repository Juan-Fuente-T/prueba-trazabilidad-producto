'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts'
import { Event } from '@/types/events'
import { getRoleName } from '@/utils/roleUtils';

// COLORES IMPORTADOS DE GLOBALS.CSS (Hardcoded aquí porque Recharts prefiere Hex)
const COLOR_INDUSTRIAL = '#0ea5e9' // --color-industrial
const COLOR_ACERO_CLARO = '#cbd5e1' // --color-acero-300
const COLORS = [COLOR_INDUSTRIAL, COLOR_ACERO_CLARO]

interface TimelineData {
    phase: string;
    hours: number;
}

interface AnalyticsProps {
    activeProductsQuantity: number;
    events: Event[];
}

interface AnalyticsProps {
    activeProductsQuantity: number
    events: Event[]
}

export default function ProductAnalytics({ activeProductsQuantity, events }: AnalyticsProps) {

    // DATOS PARA EL PIE CHART: Cuota de Producción. "activeProductsQuantity" es el número de LOTES, no la suma de cantidades.
    const safeTotal = activeProductsQuantity > 0 ? activeProductsQuantity : 1
    const percentage = ((1 / safeTotal) * 100).toFixed(1)
    const pieData = [
        { name: 'Este Lote', value: 1 },
        { name: 'Resto Producción', value: safeTotal - 1 }
    ]

    // DATOS PARA EL TIMELINE: Tiempo entre fases, diferencias de tiempo entre eventos consecutivos
    const timelineData: TimelineData[] = events.map((event, index, array) => {
        if (index === 0) return null // El primer evento (creación) no tiene "duración previa"
        const prevEvent = array[index - 1]
        // Diferencia en horas, partiendo de SEGUNDOS (Blockchain usa segundos)
        const diffMilliSeconds = Number(event.timestamp) - Number(prevEvent.timestamp)
        const diffHours = (diffMilliSeconds / (1000 * 60 * 60)).toFixed(2)
        // Nombres de fase. La fase empieza donde terminó el evento ANTERIOR (prevEvent.toAddress)
        // Y termina donde llega el evento ACTUAL (event.toAddress)
        const startRole = getRoleName(prevEvent.toAddress)
        const endRole = getRoleName(event.toAddress)

        return {
            phase: `${startRole} ➔ ${endRole}`, // Ej: Lonja -> Enlatado
            hours: parseFloat(diffHours)
        }
    }).filter((item): item is TimelineData => item !== null) // FILTRO DE TIPOS

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

            {/* GRÁFICO 1: TIEMPO DE PROCESO (Lead Time) */}
            <div className="bg-white p-4 rounded border border-acero-200 shadow-sm">
                <h4 className="text-xs font-bold text-acero-500 uppercase mb-4 tracking-wider">
                    ⏱️ Tiempos de Fase (Horas)
                </h4>
                <div className="h-48 w-full text-xs font-mono">
                    {timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timelineData} layout="vertical" margin={{ left: 10, right: 50, top: 5, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="phase" type="category" width={110} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="hours" fill="#64748b" radius={[0, 4, 4, 0]} barSize={15} activeBar={false} minPointSize={5}>
                                    <LabelList
                                        dataKey="hours"
                                        position="right"
                                        formatter={(val: unknown) => {
                                            const num = Number(val);
                                            if (num === 0) return "0h";
                                            // Si es menos de 1 hora, muestra minutos
                                            if (num < 1) {
                                                const m = Math.round(num * 60);
                                                return `${m > 0 ? m : '<1'}m`;
                                            }
                                            return `${num.toFixed(2)}h`;
                                        }}
                                        style={{ fontSize: '10px', fontWeight: 'bold', fill: '#0ea5e9' }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-acero-400 italic">
                            Insuficientes datos para calcular tiempos.
                        </div>
                    )}
                </div>
            </div>

            {/* GRÁFICO 2: CUOTA DE PRODUCCIÓN */}
            <div className="bg-white p-4 rounded border border-acero-200 shadow-sm">
                <h4 className="text-xs font-bold text-acero-500 uppercase mb-4 tracking-wider">
                    📊 Impacto en Producción Global
                </h4>
                <div className="h-40 w-full flex items-center gap-4">
                    <div className="flex-1 h-full relative">
                        {/* Texto central con el porcentaje */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-acero-800">
                                {percentage}%
                            </span>
                            <span className="text-[10px] text-acero-400 uppercase">Del Total</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Leyenda manual */}
                    <div className="w-1/3 flex flex-col gap-2 text-[10px] text-acero-600 font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-industrial rounded-full"></span>
                            <span>Este Lote</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-acero-200 rounded-full"></span>
                            <span>Total ({activeProductsQuantity})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}