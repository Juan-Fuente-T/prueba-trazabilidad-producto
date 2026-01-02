// hooks/useGetProduct.ts
'use client'
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'
import { Product } from '@/types/product'


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