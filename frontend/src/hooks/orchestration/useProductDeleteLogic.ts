import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { useGetProductFromDB } from '@/hooks/api/useGetProductFromDB'
import { useGetProduct } from '@/hooks/blockchain/useGetProduct'
import { useDeleteProduct } from '@/hooks/blockchain/useDeleteProduct'
import { useDeleteProductToDB } from '@/hooks/api/useDeleteProductToDB'
import { useToast } from '@/context/ToastContext'

interface UseProductDeleteLogicProps {
    onOptimisticDelete?: (id: string | number) => void;
    onRollback?: (id: string | number) => void;
    onSuccess?: () => void; // Para cerrar el modal
}
// export const useProductDeleteLogic = (onClose: () => void) => {
// export const useProductDeleteLogic = () => {
export const useProductDeleteLogic = ({
    onOptimisticDelete,
    onRollback,
    onSuccess
}: UseProductDeleteLogicProps = {}) => {
    const [productId, setProductId] = useState('')
    // const router = useRouter()
    const { showToast } = useToast()

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB, error: readErrorDB } = useGetProductFromDB(idParaBuscarEnBD)

    const { deleteProduct, isPending, isConfirming, isSuccess, error: deleteError, hash: txHash } = useDeleteProduct()

    const { deleteToDB, isDeletingDB, errorDB } = useDeleteProductToDB()

    // --- SINCRONIZACIÓN SILENCIOSA CON BD ---
    useEffect(() => {
        if (isSuccess && txHash && !isDeletingDB) {
            const syncDeleteToDB = async () => {
                try {
                    await deleteToDB({
                        blockchainId: Number(productId),
                        txHash: txHash,
                        expectedProductHash: product?.characterizationHash || ""
                    })

                    // Si todo va bien:
                    // router.refresh() // Refresca la lista de productos

                    // Cierra el modal tras un pequeño delay
                    // setTimeout(() => {
                    //     setProductId('')
                    //     onClose()
                    // }, 2000)

                } catch (e) {
                    console.error("Falló la eliminación del producto", e)
                    // El error se guarda en errorDB y se podría mostrar un toast aquí si se quisiera
                }
            }

            syncDeleteToDB()
        }
    }, [isSuccess, txHash])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!productId || !isOwner) return

        try {
            // UI OPTIMISTA: Lo borra de la vista YA
            if (onOptimisticDelete) {
                onOptimisticDelete(productId)
            }
            // UX: CERRAR MODAL Y AVISAR
            // Cierra inmediatamente para que el usuario vea la lista actualizada
            if (onSuccess) onSuccess();
            showToast("Solicitud de baja enviada a Blockchain...", "info");

            await deleteProduct(BigInt(productId))

        } catch (error) {
            console.error("Error al borrar:", error);
            showToast("Error al procesar la baja", "error");

            // ROLLBACK (Si falla, que vuelva a aparecer)
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
        txHash,
        setProductId,
        handleSubmit,
        status: {
            isPending,
            isConfirming,
            isSuccess,
            isDeletingDB,
            loadingDB,
            loadingBC
        },
        errors: {
            readError,
            deleteError,
            readErrorDB,
            errorDB
        }
    }
}