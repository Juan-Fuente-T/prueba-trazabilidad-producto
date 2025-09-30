'use client'

import { useEffect, useState } from 'react'
import Modal from './Modal'
import { useGetProduct } from '@/hooks/useGetProduct'
import { useDeleteProduct } from '@/hooks/useDeleteProduct'

export default function DeleteProductModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [productId, setProductId] = useState('')
    const [showError, setShowError] = useState(false)

    const { product, isOwner, isLoading } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )
    const { deleteProduct, isPending, isConfirming, isSuccess, error } = useDeleteProduct()

    useEffect(() => {
        if (error) {
            setShowError(true) // Muestra el error si existe
        }
        if (isSuccess) {
            // Espera 3 segundos para que el usuario vea el mensaje de éxito
            const timer = setTimeout(() => {
                setIsOpen(false)
                setProductId('')
            }, 3000)

            return () => clearTimeout(timer) // Limpia el timer si el componente se desmonta
        }
    }, [isSuccess, error])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("productId", productId);

        if (!isOwner) return // Se valida antes que sea dueño del producto
        //Todo: validar que el id no se de un producto ya borrado
        deleteProduct(BigInt(productId))

        setProductId('')
    }

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true)
                    setShowError(false) //Limpia el formulario si hay error
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Borrar Producto
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Delete Product">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    {productId && product && !isOwner && (
                        <p className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                            No es posible realizar la operación. Solo el dueño puede borrar el producto.
                        </p>
                    )}
                    {productId && !product && !isLoading && (
                        <p className="text-red-600 text-sm">
                            Producto no encontrado
                        </p>
                    )}
                    {isSuccess ? (
                        <p className="text-green-500 mt-2">Producto eliminado exitosamente.</p>
                    ) : (
                        showError && error && <p className="text-red-500 mt-2">{`Error al eliminar el producto: ${error}`}</p>
                    )}
                    {isPending || isConfirming ? (
                        <p className="text-blue-500 mt-2">Transacción en proceso...</p>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-red-600/90 text-white py-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isOwner || isPending || isConfirming}
                        >
                            Borrar producto
                        </button>
                    )}
                </form>
            </Modal>
        </>
    )
}