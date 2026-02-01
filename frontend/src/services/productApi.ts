/**
 * * Centraliza todas las llamadas HTTP al backend de Spring Boot
 * ℹ️ NOTA DE ARQUITECTURA: GESTIÓN DE ESTADO
 * * Para las llamadas al Backend (MongoDB), se ha optado por utilizar `fetch` nativo
 * combinado con `router.refresh()` de Next.js en lugar de Tanstack.
 * * MOTIVO:
 * Dado el volumen actual de datos y la simplicidad del CRUD, implementar una caché
 * compleja de cliente (como TanStack Query) sería "Over-engineering".
 */
import { ProductDB, ProductPayload, TransferProductPayload, DeleteProductPayload } from '@/types/product'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/products";

// ==========================================
// ESCRITURA (POST) - ACCIONES
// ==========================================
export const saveProductToDB = async (payload: ProductPayload): Promise<ProductDB> => {
    try {
    const txProduct = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const productResponse = await txProduct.json();

    if (!txProduct.ok || (productResponse.success === false)) {
        throw new Error(productResponse.message || "Error al guardar el lote en BD");
    }
    return productResponse.data || productResponse
} catch (error) {
        console.error("❌ Error guardando lote:", error);
        // Importante relanzar el error, si no parecerá que se guardó bien.
        throw error;
    }
}
export const transferProductToDB = async (payload: TransferProductPayload): Promise<ProductDB> => {
    try {
    const txTransfer = await fetch(`${BASE_URL}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const transferResponse = await txTransfer.json();

    if (!txTransfer.ok || (transferResponse.success === false)) {
        throw new Error(transferResponse.message || "Error al sincronizar transferencia");
    }
    return transferResponse.data || transferResponse
} catch (error) {
        console.error("❌ Error sincronizando transferencia:", error);
        // Importante relanzar el error, si no parecerá que se guardó bien.
        throw error;
    }
}

export const deleteProductToDB = async (payload: DeleteProductPayload): Promise<ProductDB> => {
    try {
    const txDelete = await fetch(`${BASE_URL}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const deleteResponse = await txDelete.json();

    if (!txDelete.ok || (deleteResponse.success === false)) {
        throw new Error(deleteResponse.message || "Error al eliminar el lote");
    }
    return deleteResponse.data || deleteResponse
} catch (error) {
        console.error("❌ Error eliminando el lote:", error);
        // Importante relanzar el error, si no parecerá que se guardó bien.
        throw error;
    }
}

// ==========================================
// LECTURA (GET) - DATOS
// ==========================================
export const getProductFromDB = async (productId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/${productId}`, {
            cache: 'no-store'
        })
        if (!response.ok) {
            if (response.status === 404) return null
            throw new Error("Error servidor")
        }
        const json = await response.json()
        return json.data || json
    } catch (error) {
        console.error("❌ Error de red al buscar lote:", error);
        return null;
    }
}

export const getProductListFromDB = async () => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            cache: 'no-store'
        })
        if (!response.ok) {
            if (response.status === 404) return [];
            throw new Error("Error servidor")
        }
        const json = await response.json()
        // Asegura que se devuelve un array
        return Array.isArray(json.data) ? json.data : [];

    } catch (error) {
        console.error("❌ Error de red obteniendo lotes:", error)
        return [] // En caso de pánico, devuelve lista vacía
    }
}

export const getEventListFromDB = async (productId: string) => {
    try {
    const response = await fetch(`${BASE_URL}/${productId}/history`, {
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