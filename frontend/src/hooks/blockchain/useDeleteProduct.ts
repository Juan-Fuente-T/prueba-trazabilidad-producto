// hooks/useDeleteProduct.ts
'use client'

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

export function useDeleteProduct() {
    const {
        writeContractAsync,
        data: hash,
        isPending,
        error
    } = useWriteContract()

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ //se espera a que la transacción sea minada
        hash,
    })

    const deleteProduct = async (id: bigint) => {
        return await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'deleteProduct',
        args: [id]
        })
    }

    return {
        deleteProduct,
        isPending,        // Esperando confirmación de wallet
        isConfirming,     // Esperando que se mine en blockchain
        isSuccess,        // Transacción minada exitosamente
        error,
        hash              // Hash de la transacción
    }
}