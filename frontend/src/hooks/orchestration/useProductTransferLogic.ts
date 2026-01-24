import { useState } from 'react'
import { useGetProductFromDB } from '@/hooks/api/useGetProductFromDB'
import { useGetProduct } from '@/hooks/blockchain/useGetProduct'
import { useProductCreationStore } from '@/store/useProductCreationStore'
import { useTransferProduct } from '@/hooks/blockchain/useTransferProduct'
import { useToast } from '@/context/ToastContext'
import { ProductUI } from '@/types/product'

interface UseProductTransferLogicProps {
    onOptimisticUpdate?: (product: Partial<ProductUI>) => void;
    onRollback?: (tempId: string) => void;
    onSuccess?: () => void;
}

export const useProductTransferLogic = ({ onOptimisticUpdate, onRollback, onSuccess }: UseProductTransferLogicProps) => {
    const queueAction = useProductCreationStore(s => s.queueAction);
    const [productId, setProductId] = useState('')
    const [newOwner, setNewOwner] = useState('')
    const { showToast } = useToast()

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB, error: readErrorDB } = useGetProductFromDB(idParaBuscarEnBD)

    const { transferProduct, isPending, isConfirming, isSuccess, error: writeError, hash: txHash } = useTransferProduct()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!productId || !newOwner) return

        try {
            // 🔥 UI OPTIMISTA: CAMBIA DUEÑO YA
            if (onOptimisticUpdate) {
                onOptimisticUpdate({
                    blockchainId: productId,
                    currentOwner: newOwner,
                    isVerified: false
                })
            }
            if (onSuccess) onSuccess();
            showToast("Asignación enviada a Blockchain...", "info");

            const txTransfer = await transferProduct(BigInt(productId), newOwner as `0x${string}`)
            // PONER EN COLA LA ACCIÓN
            queueAction('TRANSFERRED', {
                id: Number(productId),
                txHash: txTransfer,
                newOwner: newOwner,
                expectedHash: product?.characterizationHash || ""
            });

            // CERRAR MODAL
            if (onSuccess) onSuccess();

            showToast("Asignación firmada. Procesando...", "info");
        } catch (error) {
            console.error("Error al asignar:", error);
            showToast("Error en la asignación", "error");
            if (onRollback) {
                onRollback(productId)
            }
        }
    }
    return {
        product,
        productDB,
        isOwner,
        productId,
        newOwner,
        txHash,
        setProductId,
        setNewOwner,
        handleSubmit,
        status: {
            isPending,
            isConfirming,
            isSuccess,
            loadingDB,
            loadingBC
        },
        errors: {
            readError,
            readErrorDB,
            writeError
        }
    }
}