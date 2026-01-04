export interface Event {
    id: string
    blockchainId: number
    productHash: string
    txHash: string
    from: string
    to: string
    type: TypeEvent
    timestamp: number
}

export type TypeEvent = 'CREATED' | 'TRANSFERRED' | 'DELETED'