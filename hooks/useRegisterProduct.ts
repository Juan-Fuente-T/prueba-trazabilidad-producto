// hooks/useRegisterProduct.ts
'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

console.log("CONTRACT_ADDRESS", CONTRACT_ABI);

export function useRegisterProduct() {
    const {
        writeContract,
        data: hash,
        isPending,
        error
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const register = (quantity: bigint, characterizationHash: `0x${string}`) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'registerProduct',
            args: [quantity, characterizationHash]
        })
    }
    console.log('Producto registrado:', hash)
    return {
        register,
        isPending,        // Esperando confirmación de wallet
        isConfirming,     // Esperando que se mine en blockchain
        isSuccess,        // Transacción minada exitosamente
        error,
        hash              // Hash de la transacción
    }
}