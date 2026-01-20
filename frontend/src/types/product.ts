export interface ProductDB {
    id?: string | string // ID de Mongo
    blockchainId: number | string
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
    blockchainId: number | string;
    txHash: string;
    newOwnerAddress: string;
    expectedProductHash: string;
}

export interface DeleteProductPayload {
    blockchainId: number | string;
    txHash: string;
    expectedProductHash: string;
}
// Interface para UI optimista que se anticipa a la respuesta desde blockchain
export interface ProductUI extends ProductDB {
    isVerified?: boolean;
    isOptimistic?: boolean;
}