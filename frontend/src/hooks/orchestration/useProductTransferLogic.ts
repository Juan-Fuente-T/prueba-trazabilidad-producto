import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGetProductFromDB } from '@/hooks/api/useGetProductFromDB'
import { useGetProduct } from '@/hooks/blockchain/useGetProduct'
import { useTransferProduct } from '@/hooks/blockchain/useTransferProduct'
import { useTransferProductToDB } from '@/hooks/api/useTransferProductToDB'

// export const useProductTransferLogic = (onClose: () => void) => {
export const useProductTransferLogic = () => {
    const [productId, setProductId] = useState('')
    const [newOwner, setNewOwner] = useState('')
    const router = useRouter()

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB, error: readErrorDB } = useGetProductFromDB(idParaBuscarEnBD)

    const { transferProduct, isPending, isConfirming, isSuccess, error: writeError, hash: txHash } = useTransferProduct()

    const { transferToDB, isTransferingDB, errorDB } = useTransferProductToDB()

    useEffect(() => {
        if (isSuccess && txHash && !isTransferingDB) {
            const syncWithBackend = async () => {
                try {
                    await transferToDB({
                        blockchainId: Number(productId),
                        txHash: txHash,
                        newOwnerAddress: newOwner,
                        expectedProductHash: product?.characterizationHash || ""
                    })

                    // Si todo va bien:
                    router.refresh() // Refresca la lista de productos

                    // Cierra modal tras un pequeño delay??
                    setTimeout(() => {
                        setNewOwner('')
                        // onClose()
                    }, 2000)

                } catch (e) {
                    console.error("Falló la sincronización con BD", e)
                }
            }
            syncWithBackend()
        }
    }, [isSuccess, txHash])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!productId || !newOwner) return
        //Todo: validar que el id no sea de un producto ya borrado
        transferProduct(BigInt(productId), newOwner as `0x${string}`)
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
            isTransferingDB,
            loadingDB,
            loadingBC
        },
        errors: {
            readError,
            readErrorDB,
            writeError,
            errorDB
        }
    }

}