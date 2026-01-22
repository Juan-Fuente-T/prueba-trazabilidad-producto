'use client'
import { SUPPLY_CHAIN_ADDRESSES } from '@/config/supplyChainRoles'

interface Props {
    isOwner: boolean
    onSelect: (address: string) => void
}

export default function RoleSelectorButtons({ isOwner, onSelect }: Props) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-acero-700">Nuevo Custodio</label>
            <div className="flex flex-col md:flex-row gap-2">
                <button
                    type="button"
                    onClick={() => onSelect(SUPPLY_CHAIN_ADDRESSES.ENLATADO || '')}
                    disabled={!isOwner}
                    className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    🏭 Enlatado
                </button>
                <button
                    type="button"
                    onClick={() => onSelect(SUPPLY_CHAIN_ADDRESSES.DISTRIBUCION || '')}
                    disabled={!isOwner}
                    className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    🚚 Distribución
                </button>
                <button
                    type="button"
                    onClick={() => onSelect(SUPPLY_CHAIN_ADDRESSES.PUNTO_VENTA || '')}
                    disabled={!isOwner}
                    className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    🏪 Tienda
                </button>
            </div>
        </div>
    )
}