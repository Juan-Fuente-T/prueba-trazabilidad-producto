export interface Event {
    id: string
    productBlockchainId: number
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