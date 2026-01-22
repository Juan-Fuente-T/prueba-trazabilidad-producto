import { Event } from '@/types/events'
import { formatDate, shortenAddress } from '@/utils/formatters'
import { getRoleName } from '@/utils/roleUtils'
import { getEventBadgeColor, getShortDescription } from '@/utils/eventUiUtils'

interface Props {
    event: Event
}

export default function HistoryCard({ event }: Props) {
    const isCreation = event.type === 'CREATED';
    const isDeleted = event.type === 'DELETED';
    const hasVerification = event.isVerified || event.verified;

    const faseActual = isCreation
        ? "🐟 LONJA/ORIGEN"
        : isDeleted ? "⛔ ELIMINADO"
            : (event.toAddress ? getRoleName(event.toAddress) : "DESCONOCIDO");

    return (
        <div className="relative h-full bg-acero-50 p-2 gap-1 rounded-xl border border-acero-200 shadow-sm hover:shadow-md transition-all text-center w-48 flex-shrink-0 flex flex-col justify-between">
            {/* CHECK DE VERIFICACION */}
            {hasVerification && (
                <div title="Verificado en Blockchain" className="absolute top-2 right-2 text-emerald-500 bg-white rounded-full p-0.5 shadow-sm border border-emerald-100 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
            {/* CABECERA */}
            <div className="flex flex-col w-full">
                {/* FECHA Y HORA */}
                <div className="text-[10px] text-acero-800 font-mono mb-1 uppercase tracking-wider mr-4">
                    {formatDate(event.timestamp)}
                </div>

                {/* TIPO DE EVENTO (BADGE) - Usamos tu utilidad existente */}
                <div className={`self-center inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 border ${getEventBadgeColor(event.type)}`}>
                    {event.type}
                </div>

                {/* FASE ACTUAL */}
                <div className={`text-[10px] font-extrabold px-2 py-1 mb-2 rounded bg-acero-100 text-acero-600 border border-acero-200 uppercase ${isDeleted ? 'text-red-600 bg-red-50 border-red-100' : ''}`}>
                    {faseActual}
                </div>

                {/* DESCRIPCIÓN */}
                <p className="text-xs font-medium text-acero-700 mb-2">
                    {getShortDescription(event.type)}
                </p>
            </div>

            {/* PARTE INFERIOR (Flujo de direcciones) */}
            <div className="flex flex-col items-center gap-0.5 mt-auto w-full pt-2 border-t border-acero-100">

                {/* CASO 1: ES CREACIÓN */}
                {isCreation ? (
                    <div className="w-full flex flex-col items-center justify-center py-2 min-h-[32px]">
                        <span className="text-xl">➡️</span>
                        <span className="text-md font-bold text-acero-700 uppercase tracking-widest">
                            Origen
                        </span>
                    </div>
                ) : (
                    /* CASO 2: ES TRANSFERENCIA O BORRADO (Muestra De:) */
                    event.fromAddress && (
                        <div className="w-full flex justify-between items-center px-1 h-[20px]">
                            <span className="text-[9px] font-mono text-acero-500 tracking-tighter">
                                {shortenAddress(event.fromAddress)}
                            </span>
                            <span className="text-[9px] font-bold text-acero-700 truncate max-w-[90px]">
                                {getRoleName(event.fromAddress)}
                            </span>
                        </div>
                    )
                )}

                {/* FLECHA CONECTORA */}
                {!isCreation && (
                    <div className="text-acero-700 text-[16px]">⬇</div>
                )}

                {/* LÓGICA DE DESTINO */}
                {/* SI NO es borrado, muestra el destino normal */}
                {!isDeleted && !isCreation && event.toAddress && (
                    <div className="w-full flex justify-between items-center px-1 bg-acero-50/80 rounded h-[20px]">
                        <span className="text-[9px] font-mono text-acero-500 tracking-tighter">
                            {shortenAddress(event.toAddress)}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 truncate max-w-[90px]">
                            {getRoleName(event.toAddress)}
                        </span>
                    </div>
                )}

                {isDeleted && (
                    <div className="w-full flex items-center justify-center bg-red-50 rounded h-[20px] border border-red-100">
                        <span className="text-[10px] font-bold text-red-600 uppercase py-0">
                            🔥 Eliminado
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}