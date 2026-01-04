/**
 * ℹ️ NOTA DE ARQUITECTURA: GESTIÓN DE ESTADO
 * * Para las llamadas al Backend (MongoDB), se ha optado por utilizar `fetch` nativo
 * combinado con `router.refresh()` de Next.js en lugar de Tanstack.
 * * MOTIVO:
 * Dado el volumen actual de datos y la simplicidad del CRUD, implementar una caché
 * compleja de cliente (como TanStack Query) sería "Over-engineering".
 */
import { ProductPayload, ProductDB } from '@/types/product'

export const saveProductToDB = async (payload: ProductPayload): Promise<ProductDB> => {
    try {
    const txProduct = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const productResponse = await txProduct.json();

    if (!txProduct.ok || (productResponse.success === false)) {
        throw new Error(productResponse.message || "Error al guardar el producto en BD");
    }
    return productResponse.data || productResponse
} catch (error) {
        console.error("❌ Error guardando producto:", error);
        // Importante relanzar el error, si no parecerá que se guardó bien.
        throw error;
    }
}