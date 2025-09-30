'use client'

import { useState } from 'react'
import Modal from './Modal'
import { useGetProduct } from '@/hooks/useGetProduct'
import { useDeleteProduct } from '@/hooks/useDeleteProduct'

export default function DeleteProductModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [productId, setProductId] = useState('')
    const { isOwner } = useGetProduct(productId ? BigInt(productId) : undefined)
    const { deleteProduct, isPending, isConfirming, isSuccess, error } = useDeleteProduct()


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!isOwner) return // Se valida antes que sea dueño del producto
        deleteProduct(BigInt(productId))

        console.log('Delete product:', productId)
        setIsOpen(false)
        setProductId('')
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
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
                    {!isOwner && (
                        <p className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                            No es posible realizar la operación. Solo el dueño puede borrar el producto.
                        </p>
                    )}
                    {isSuccess ? (
                        <p className="text-green-500 mt-2">Producto registrado exitosamente.</p>
                    ) : (
                        <p className="text-red-500 mt-2">{`Error al registrar el producto: ${error}`}</p>
                    )}
                    {isPending || isConfirming ? (
                        <p className="text-blue-500 mt-2">Transacción en proceso...</p>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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