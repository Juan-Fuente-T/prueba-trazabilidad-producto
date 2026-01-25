import { useState } from 'react'
import { useGetProductFromDB } from '@/hooks/api/useGetProductFromDB'
import { useGetProduct } from '@/hooks/blockchain/useGetProduct'
import { useDeleteProduct } from '@/hooks/blockchain/useDeleteProduct'
import { useProductCreationStore } from '@/store/useProductCreationStore'
import { useToast } from '@/context/ToastContext'

interface UseProductDeleteLogicProps {
    onOptimisticDelete?: (id: string | number) => void;
    onRollback?: (id: string | number) => void;
    onSuccess?: () => void; // Para cerrar el modal
}

export const useProductDeleteLogic = ({ onOptimisticDelete, onRollback, onSuccess }: UseProductDeleteLogicProps = {}) => {
    const queueAction = useProductCreationStore(s => s.queueAction);
    const [productId, setProductId] = useState('')
    const { showToast } = useToast()

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB, error: readErrorDB } = useGetProductFromDB(idParaBuscarEnBD)

    const { deleteProduct, isPending, isConfirming, isSuccess, error: deleteError, hash: txHash } = useDeleteProduct()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!productId || !isOwner) return
        const currentId = productId;

        try {
            // UI OPTIMISTA: Lo borra de la vista YA
            if (onOptimisticDelete) {
                onOptimisticDelete(currentId)
            }
            showToast("Solicitando firma...", "info");
            // writeContractAsync devuelve el hash en milisegundos tras la firma.
            const txDelete = await deleteProduct(BigInt(currentId))

            // PONER EN COLA LA ACCIÓN
            queueAction('DELETED', {
                id: Number(currentId),
                txHash: txDelete,
                expectedHash: product?.characterizationHash || ""
            });

            if (onSuccess) onSuccess();

            showToast("Baja firmada. Procesando...", "info");
        } catch (error) {
            console.error("Error al borrar:", error);
            showToast("Error al procesar la baja", "error");
            // ROLLBACK (Si falla, vuelve a aparecer)
            if (onRollback) {
                onRollback(currentId)
            }
        }
    }

    return {
        product,
        productDB,
        isOwner,
        productId,
        txHash,
        setProductId,
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
            deleteError,
            readErrorDB
        }
    }
}