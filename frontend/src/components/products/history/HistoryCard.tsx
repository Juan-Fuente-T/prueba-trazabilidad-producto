import { Event } from '@/types/events'
import { formatDate, shortenAddress } from '@/utils/formatters'
import { getRoleName } from '@/utils/roleUtils'
import { getEventBadgeColor, getShortDescription } from '@/utils/eventUiUtils'

interface Props {
    event: Event
}

export default function HistoryCard({ event }: Props) {
    const isCreation = event.type === 'CREATED';

    return (
        <div className="bg-stone-50 p-3 gap-2 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all text-center w-48 flex-shrink-0">

            {/* FECHA Y HORA */}
            <div className="text-[10px] text-stone-800 font-mono mb-1 uppercase tracking-wider">
                {formatDate(event.timestamp)}
            </div>

            {/* TIPO DE EVENTO (BADGE) */}
            <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 border ${getEventBadgeColor(event.type)}`}>
                {event.type}
            </div>

            {/* 3. DESCRIPCIÓN */}
            <p className="text-xs font-medium text-stone-700 mb-2">
                {getShortDescription(event.type)}
            </p>

            {/* PARTE INFERIOR (Flujo de direcciones) */}
            <div className="flex flex-col items-center gap-1 mt-2 pt-2 border-t border-stone-50 w-full flex-grow justify-end">

                {/* CASO 1: ES CREACIÓN (RELLENAMOS EL HUECO VACÍO) */}
                {isCreation ? (
                    <div className="w-full flex flex-col items-center justify-center py-1">
                        <span className="text-xl ">➡️</span>
                        <span className="text-sm font-bold text-stone-700 uppercase tracking-widest">
                            Origen
                        </span>
                    </div>
                ) : (
                    /* CASO 2: ES TRANSFERENCIA O BORRADO (HAY ORIGEN) */
                    event.from && (
                        <div className="w-full flex justify-between items-center px-2">
                            <span className="text-[9px] text-stone-700">De:</span>
                            <div className="text-right">
                                <span className="block text-[10px] font-bold text-stone-800">
                                    {getRoleName(event.from)}
                                </span>
                                <span className="block text-[9px] font-mono text-stone-700">
                                    {shortenAddress(event.from)}
                                </span>
                            </div>
                        </div>
                    )
                )}

                {/* FLECHA CONECTORA (Solo si no es creación) */}
                {!isCreation && (
                    <div className="text-stone-700 text-[16px]">⬇</div>
                )}

                {/* DESTINO */}
                {event.to && (
                    <div className="w-full flex justify-between items-center px-2 bg-stone-50 rounded py-1 mt-1">
                        <span className="text-[9px] text-stone-700">A:</span>
                        <div className="text-right">
                            <span className="block text-[10px] font-bold text-emerald-700">
                                {getRoleName(event.to)}
                            </span>
                            <span className="block text-[9px] font-mono text-stone-700">
                                {shortenAddress(event.to)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}