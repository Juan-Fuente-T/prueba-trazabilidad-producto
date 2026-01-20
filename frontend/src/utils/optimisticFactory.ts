import { Event, TypeEvent } from '@/types/events'

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