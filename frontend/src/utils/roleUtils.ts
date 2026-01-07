
import { SUPPLY_CHAIN_ADDRESSES } from '@/config/supplyChainRoles' // 🔥 IMPORTAMOS DE CONFIG

export const getRoleName = (address: string | undefined): string => {
    if (!address) return "Desconocido";
    const addr = address.toLowerCase();

    if (addr === SUPPLY_CHAIN_ADDRESSES.MAYORISTA) return "📦 Distribuidor";
    if (addr === SUPPLY_CHAIN_ADDRESSES.TRANSPORTISTA) return "🚚 Transportista";
    if (addr === SUPPLY_CHAIN_ADDRESSES.PUNTO_VENTA) return "🏪 Punto de Venta";

    return "🏭Fabricante";
}