import { Event, TypeEvent } from '@/types/events'
import { ProductFormData, ProductDB } from '@/types/product';

export const createBaseProductObject = (
    formData: ProductFormData,
    hash: string,
    owner: string,
    id: string | number,
    imageUrl: string
): Omit<ProductDB, 'id'> => { // Omite '_id' de mongo porque se genera en BD
    return {
        name: formData.name,
        description: formData.description,
        quantity: Number(formData.quantity),
        blockchainId: id,
        characterizationHash: hash,
        currentOwner: owner,
        imageUrl: imageUrl,
        // Valores por defecto para nuevos productos
        active: true,
        timestamp: Date.now()
    };
};


export const createOptimisticEvent = (
    productBlockchainId: number | string,
    txHash: string = "0xPendiente...", // Hash temporal
    productHash: string,
    type: TypeEvent,
    fromAddress: string,
    toAddress: string,
): Event => {
    return {
        id: `temp-${Date.now()}`, // ID temporal que luego la BD reemplazará
        productBlockchainId,
        transactionHash: txHash,
        productHash,
        fromAddress,
        toAddress,
        type,
        timestamp: Math.floor(Date.now() / 1000), // Ahora mismo
        isVerified: false
    };
};