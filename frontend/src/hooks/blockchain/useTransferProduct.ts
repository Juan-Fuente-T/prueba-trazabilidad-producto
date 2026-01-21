// hooks/useTransferProduct.ts
'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

export function useTransferProduct() {
    const {
        writeContractAsync,
        data: hash,
        isPending,
        error
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const transferProduct = async (id: bigint, newOwner: `0x${string}`) => {
        return await writeContractAsync ({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'transferProduct',
            args: [id, newOwner]
        })
    }

    return {
        transferProduct,
        isPending,        // Esperando confirmación de wallet
        isConfirming,     // Esperando que se mine en blockchain
        isSuccess,        // Transacción minada exitosamente
        error,
        hash              // Hash de la transacción
    }
}