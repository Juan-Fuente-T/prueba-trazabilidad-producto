'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '../../ui/Modal'
import { useGetProduct } from '@/hooks/useGetProduct'
import { useDeleteProduct } from '@/hooks/useDeleteProduct'
import { useGetProductFromDB } from '@/hooks/useGetProductFromDB'
import ProductInfoCard from '@/components/products/ProductInfoCard'

interface DeleteProductModalProps {
    isOpen: boolean
    onClose: () => void
    preFilledId?: string
}

export default function DeleteProductModal({ isOpen, onClose, preFilledId }: DeleteProductModalProps) {
    const [productId, setProductId] = useState('')
    const router = useRouter()

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId !== '' ? BigInt(productId) : undefined
    )
    const { deleteProduct, isPending, isConfirming, isSuccess, error: deleteError } = useDeleteProduct()

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB } = useGetProductFromDB(idParaBuscarEnBD)

    useEffect(() => {
    // Si está abierto y ha llegado un ID prefijado, se asigna.
    if (isOpen && preFilledId) {
        setProductId(preFilledId)
    } else {
        setProductId('')
    }
}, [isOpen, preFilledId])

    // Timer éxito
    useEffect(() => {
        if (isSuccess) {
            router.refresh()
            const timer = setTimeout(() => onClose(), 3000)
            return () => clearTimeout(timer)
        }
    }, [isSuccess, onClose])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!isOwner) return // Validación dueño del producto
        //Todo: validar que el id no se de un producto ya borrado
        deleteProduct(BigInt(productId))
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Product">
            <form onSubmit={handleSubmit} className="space-y-4 z-[999]">
                <div>
                    <label className="block text-sm font-medium mb-1">Product ID</label>
                    <input
                        type="number"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter product ID"
                        required
                        min={1}
                    //Todo: añadir no permitir letras o decimales
                    />
                </div>
                {/* FICHA DE INFORMACIÓN */}
                <ProductInfoCard
                    productId={productId}
                    product={product}
                    productDB={productDB}
                    loadingDB={loadingDB}
                    isLoadingBlockchain={loadingBC}
                    isOwner={isOwner}
                    variant="default"
                    minHeight="130px"
                />

                {/* Mensajes Éxito/Error Acción */}
                {isSuccess ? (
                    <p className="text-green-600 font-bold text-center bg-green-50 p-3 rounded border border-green-200">
                        🗑️ Producto eliminado correctamente.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {(deleteError || (readError && !readError.message.includes("reverted"))) && (
                            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-200 break-words">
                                Error: {deleteError?.message || readError?.message}
                            </p>
                        )}
                    </div>
                )}

                {/* Botón borrado*/}
                <button
                    type="submit"
                    className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                    disabled={!isOwner || !product || isPending || isConfirming}
                >
                    {isPending || isConfirming ? 'Borrando en Blockchain...' : 'Confirmar Borrado'}
                </button>
            </form>
        </Modal>
    )
}