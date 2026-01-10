export interface ProductDB {
    id?: string  // ID de Mongo
    blockchainId: number
    quantity: number
    characterizationHash?: string
    currentOwner: string
    active: boolean
    timestamp: number
    name: string
    description: string
    imageUrl: string
}

export interface Product {
    quantity: bigint
    characterizationHash: `0x${string}`
    currentOwner: `0x${string}`
    timestamp: bigint
    exists: boolean
}

export interface ProductPayload {
    product: Omit<ProductDB, 'id' | '_id' | 'blockchainId'> & { blockchainId: number }; // Producto sin ID de mongo
    creationTxHash: string;
}

export interface TransferProductPayload {
    blockchainId: number;
    txHash: string;
    newOwnerAddress: string;
    expectedProductHash: string;
}

export interface DeleteProductPayload {
    blockchainId: number;
    txHash: string;
    expectedProductHash: string;
}