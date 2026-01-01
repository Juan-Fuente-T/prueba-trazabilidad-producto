// src/services/productService.ts
import { ProductPayload, ProductDB } from '@/types/product'

export const saveProductToDB = async (payload: ProductPayload): Promise<ProductDB> => {
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
}