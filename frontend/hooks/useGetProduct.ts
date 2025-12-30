// hooks/useGetProduct.ts
'use client'
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

type Product = {
    quantity: bigint
    characterizationHash: `0x${string}`
    currentOwner: `0x${string}`
    timestamp: bigint
    exists: boolean
}

export function useGetProduct(productId?: bigint) {
    const { address } = useAccount()

    const { data: product, isLoading, error } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getProduct',
        args: productId ? [productId] : undefined,
        query: {
            enabled: !!productId
        }
    }) as { data: Product | undefined, isLoading: boolean, error: Error | null }

    const isOwner = product && address
        ? product.currentOwner.toLowerCase() === address.toLowerCase()
        : false

    return {
        product,
        isLoading,
        error,
        isOwner
    }
}