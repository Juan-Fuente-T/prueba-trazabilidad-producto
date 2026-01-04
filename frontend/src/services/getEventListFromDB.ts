/**
 * ℹ️ NOTA DE ARQUITECTURA: GESTIÓN DE ESTADO
 * * Para las llamadas al Backend (MongoDB), se ha optado por utilizar `fetch` nativo
 * combinado con `router.refresh()` de Next.js en lugar de Tanstack.
 * * MOTIVO:
 * Dado el volumen actual de datos y la simplicidad del CRUD, implementar una caché
 * compleja de cliente (como TanStack Query) sería "Over-engineering".
 */
export const getEventListFromDB = async (productId: string) => {
    try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${productId}/history`, {
            cache: 'no-store'
        })
    if (!response.ok) {
        // if (response.status === 404) return null
        // throw new Error("Error servidor")
        console.error(`⚠️ Error del servidor al buscar eventos para ID ${productId}: ${response.status}`);
        return [];
    }
    const json = await response.json()
    // Asegura que se devuelve un array
    return Array.isArray(json.data) ? json.data : [];

    } catch (error) {
        console.error("❌ Error de red obteniendo eventos:", error)
        return [] // En caso de pánico, devuelve lista vacía
    }
}