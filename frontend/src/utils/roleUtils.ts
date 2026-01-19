
import { SUPPLY_CHAIN_ADDRESSES } from '@/config/supplyChainRoles' // 🔥 IMPORTAMOS DE CONFIG

export const getRoleName = (address: string | undefined): string => {
    if (!address) return "Desconocido";
    const addr = address.toLowerCase();

    if (addr === SUPPLY_CHAIN_ADDRESSES.ENLATADO) return "📦 Enlatado";
    if (addr === SUPPLY_CHAIN_ADDRESSES.DISTRIBUCION) return "🚚 Distribución";
    if (addr === SUPPLY_CHAIN_ADDRESSES.PUNTO_VENTA) return "🏪 Punto de Venta";

    return "🐟Lonja/Origen";
}

//FUNCIÓN VISUAL (Para la Tabla y las Cards, con colores)
export function getActorInfo(address: string | undefined) {
    if (!address) return {
        role: "Desconocido",
        status: "❓ Sin Datos",
        color: "bg-gray-100 text-gray-500 border-gray-200"
    };

    const addr = address.toLowerCase();

    // Lógica visual basada en los roles
    if (addr === SUPPLY_CHAIN_ADDRESSES.ENLATADO?.toLowerCase()) {
        return {
            role: "🏭 Planta Conservera",
            status: "⚙️ Enlatado/Proceso",
            color: "bg-amber-100 text-amber-700 border-amber-200"
        };
    }

    if (addr === SUPPLY_CHAIN_ADDRESSES.DISTRIBUCION?.toLowerCase()) {
        return {
            role: "🚚 Distribución",
            status: "📦 En Tránsito",
            color: "bg-indigo-100 text-indigo-700 border-indigo-200"
        };
    }

    if (addr === SUPPLY_CHAIN_ADDRESSES.PUNTO_VENTA?.toLowerCase()) {
        return {
            role: "🏪 Punto de Venta",
            status: "🏁 Disponible al Público",
            color: "bg-emerald-100 text-emerald-700 border-emerald-200"
        };
    }

    // Por defecto (Lonja)
    return {
        role: "⚓ Lonja / Origen",
        status: "🐟 Captura Registrada",
        color: "bg-industrial/10 text-industrial-dark border-industrial/20"
    };
}