'use client'
import { Event } from '@/types/events'
import { getEventColor,  getEventIcon } from '@/utils/eventUiUtils'
import HistoryCard from './HistoryCard'

interface ProductHistoryProps {
    events: Event[];
}

export default function ProductHistory({ events }: ProductHistoryProps) {

    if (!events || events.length === 0) {
        return <div className="text-stone-400 text-sm md:text-xl font-semibold italic p-4">No hay historial registrado.</div>
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-stone-700 border-b border-stone-200 text-center md:text-start p-2 md:pt-4">
                ⏳ Historial de Trazabilidad
            </h3>
            <div className="w-full overflow-x-auto pb-6 custom-scrollbar">

                {/* LÍNEA DE TIEMPO (Flex Row en Desktop, Col en Mobile si quisieras, pero forzamos row aquí) */}
                <div className="flex min-w-full md:min-w-0 items-start">

                    {events.map((event, index) => (
                        <div key={event.id} className="relative flex flex-col items-center min-w-[200px] max-w-[240px] group">
                            {/* 1. LÍNEA CONECTORA (Gris detrás) */}
                            {/* Si no es el último, dibuja línea a la derecha */}
                            {index !== events.length - 1 && (
                                <div className="absolute top-[14px] left-[50%] w-full h-[2px] bg-stone-300 z-2" />
                            )}
                            {/* Si no es el primero, dibujamos línea a la izquierda (para conectar bien) */}
                            {index !== 0 && (
                                <div className="absolute top-[14px] right-[50%] w-full h-[2px] bg-stone-300 z-2" />
                            )}

                            {/* PUNTO CENTRAL - ICONO */}
                            <div className={`w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 mb-3 ${getEventColor(event.type)}`}>
                                <span className="text-[18px] text-white">
                                    {getEventIcon(event.type)}
                                </span>
                            </div>

                            <HistoryCard event={event} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

