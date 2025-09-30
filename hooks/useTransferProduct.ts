// hooks/useRegisterProduct.ts
'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

export function useTransferProduct() {
    const {
        writeContract,
        data: hash,
        isPending,
        error
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const transfer = (id: bigint, newOwner: `0x${string}`) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'transferProduct',
            args: [id, newOwner]
        })
    }

    return {
        transfer,
        isPending,        // Esperando confirmación de wallet
        isConfirming,     // Esperando que se mine en blockchain
        isSuccess,        // Transacción minada exitosamente
        error,
        hash              // Hash de la transacción
    }
}