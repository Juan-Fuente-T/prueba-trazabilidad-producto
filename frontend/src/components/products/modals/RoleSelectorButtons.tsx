'use client'
import { SUPPLY_CHAIN_ADDRESSES } from '@/config/supplyChainRoles'

interface Props {
    isOwner: boolean
    onSelect: (address: string) => void
}

export default function RoleSelectorButtons({ isOwner, onSelect }: Props) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nuevo Destino</label>
            <div className="flex flex-col md:flex-row gap-2">
                <button
                    type="button"
                    onClick={() => onSelect(SUPPLY_CHAIN_ADDRESSES.MAYORISTA || '')}
                    disabled={!isOwner}
                    className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    🏭 Mayorista
                </button>
                <button
                    type="button"
                    onClick={() => onSelect(SUPPLY_CHAIN_ADDRESSES.TRANSPORTISTA || '')}
                    disabled={!isOwner}
                    className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    🚚 Transportista
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