'use client'

import { useEffect, useState } from 'react'
import Modal from './Modal'
import { useGetProduct } from '@/hooks/useGetProduct'
import { useTransferProduct } from '@/hooks/useTransferProduct'

export default function TransferProductModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [productId, setProductId] = useState('')
    const [newOwner, setNewOwner] = useState('')
    const [showError, setShowError] = useState(false)

    const { product, isOwner, isLoading } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )
    const { transferProduct, isPending, isConfirming, isSuccess, error } = useTransferProduct()

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
        console.log('Transfer product:', { productId, newOwner })

        if (!isOwner) return // Se valida antes que sea dueño del producto
        //Todo: validar que el id no se de un producto ya borrado
        transferProduct(BigInt(productId), newOwner as `0x${string}`)

        setProductId('')
        setNewOwner('')
    }

    return (
        <>
            <button
                onClick={() => {
                    setIsOpen(true)
                    setShowError(false) //Limpia el formulario si hay error
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Transfer Product
            </button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Transfer Product">
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
                    <div>
                        <label className="block text-sm font-medium mb-1">New Owner Address</label>
                        <input
                            type="text"
                            value={newOwner}
                            onChange={(e) => setNewOwner(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="0x..."
                            pattern="^0x[a-fA-F0-9]{40}$"
                            required
                        />
                    </div>
                    {productId && product && !isOwner && (
                        <p className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                            No es posible realizar la operación. Solo el dueño puede transferir el producto.
                        </p>
                    )}
                    {productId && !product && !isLoading && (
                        <p className="text-red-600 text-sm">
                            Producto no encontrado
                        </p>
                    )}
                    {isSuccess ? (
                        <p className="text-green-500 mt-2">Producto transferido exitosamente.</p>
                    ) : (
                        showError && error && <p className="text-red-500 mt-2">{`Error al transferir el producto: ${error}`}</p>
                    )}
                    {isPending || isConfirming ? (
                        <p className="text-blue-500 mt-2">Transacción en proceso...</p>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isOwner || !newOwner || isPending || isConfirming}
                        >
                            Transferir producto
                        </button>
                    )}
                </form>
            </Modal>
        </>
    )
}