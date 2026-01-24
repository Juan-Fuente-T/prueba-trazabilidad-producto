import { ProductFormData, ProductUI } from '@/types/product';

export interface Event {
    id: string
    productBlockchainId: number | string
    transactionHash: string
    productHash: string
    fromAddress: string
    toAddress: string
    type: TypeEvent
    timestamp: number
    isVerified?: boolean
    verified?: boolean
}

export type TypeEvent = 'CREATED' | 'TRANSFERRED' | 'DELETED'

export type PendingItem = {
    id: string | number;
    hash: string;
}

export interface ActionPayload {
    txHash: string;       // El hash de la transacción de blockchain
    // Create
    formData?: ProductFormData; // Datos del formulario (nombre, desc., cantidad )
    creationHash?: string; // El hash de producto calculado antes de firmar
    tempId?: string;       //ID temporal para UI optimista
    imageString?: string;  // La imagen en base64
    // Delete / Transfer / Create (Real ID)
    id?: number;
    expectedHash?: string;//
    // Transfer
    newOwner?: string;
}

export interface PendingAction {
    type: TypeEvent;
    data: ActionPayload;
}

export interface WorkerUpdate {
    lookupId: string | number;
    changes: Partial<ProductUI>;
}