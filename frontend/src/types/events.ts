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