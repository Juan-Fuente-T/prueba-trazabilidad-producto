import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGetProductFromDB } from '@/hooks/api/useGetProductFromDB'
import { useGetProduct } from '@/hooks/blockchain/useGetProduct'
import { useDeleteProduct } from '@/hooks/blockchain/useDeleteProduct'
import { useDeleteProductToDB } from '@/hooks/api/useDeleteProductToDB'

export const useProductDeleteLogic = (onClose: () => void) => {
// export const useProductDeleteLogic = () => {
    const [productId, setProductId] = useState('')
    const router = useRouter()

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB, error: readErrorDB } = useGetProductFromDB(idParaBuscarEnBD)

    const { deleteProduct, isPending, isConfirming, isSuccess, error: deleteError, hash: txHash } = useDeleteProduct()

    const { deleteToDB, isDeletingDB, errorDB } = useDeleteProductToDB()

    // Timer éxito
    useEffect(() => {
        if (isSuccess && txHash && !isDeletingDB) {
            const deleteProduct = async () => {
            try {
                    await deleteToDB({
                        blockchainId: Number(productId),
                        txHash: txHash,
                        expectedProductHash: product?.characterizationHash || ""
                    })

                    // Si todo va bien:
                    router.refresh() // Refresca la lista de productos

                    // Cierra el modal tras un pequeño delay
                    setTimeout(() => {
                        setProductId('')
                        onClose()
                    }, 2000)

                } catch (e) {
                    console.error("Falló la eliminación del producto", e)
                    // Aquí el usuario verá el errorDB gracias al return de abajo
                }
            }

            deleteProduct()
        }
    }, [isSuccess, txHash])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!productId || !isOwner) return
        //Todo: validar que el id no se de un producto ya borrado
        deleteProduct(BigInt(productId))
    }

    return {
        product,
        productDB,
        isOwner,
        productId,
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