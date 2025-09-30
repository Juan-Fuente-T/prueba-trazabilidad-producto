'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useDeleteProduct } from '@/hooks/useDeleteProduct'
import { useTransferProduct } from '@/hooks/useTransferProduct'
import ConfirmDeleteModal from "./ConfirmDeleteModal"

type Product = {
    quantity: bigint
    characterizationHash: `0x${string}`
    currentOwner: `0x${string}`
    timestamp: bigint
    exists: boolean
}

type ProductCardProps = {
    productId: bigint
    product: Product
    onClose: () => void
}

export default function ProductCard({ productId, product, onClose }: ProductCardProps) {
    const { address } = useAccount() // Cuenta conectada
    const [newOwner, setNewOwner] = useState('')
    const [showTransfer, setShowTransfer] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const { deleteProduct, isPending: isDeleting } = useDeleteProduct()
    const { transferProduct, isPending: isTransferring } = useTransferProduct()

    //verifica que la cuenta conectada y el owner del producto sean la misma
    const isOwner = address?.toLowerCase() === product.currentOwner.toLowerCase()

    const handleDelete = () => {
        setShowConfirm(true) // nuestra el modal de confirmación
    }
    const confirmDelete = () => {
        deleteProduct(productId)
        setShowConfirm(false) // cerramos el modal
    }

    const cancelDelete = () => {
        setShowConfirm(false) // simplemente ocultamos
    }

    const handleTransfer = () => {
        if (newOwner && newOwner.match(/^0x[a-fA-F0-9]{40}$/)) {
            transferProduct(productId, newOwner as `0x${string}`)
            setNewOwner('')
            setShowTransfer(false)
        }
    }

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">Producto #{productId.toString()}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {product.quantity.toString()}</p>
                </div>
                <div>
                {isOwner && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Eres el dueño
                    </span>
                )}
                <button
                    onClick={() => onClose()}
                    disabled={isTransferring || !newOwner}
                    className="text-black w-fit px-2 py-1 m-2 border border-gray-800 rounded cursor-pointer disabled:opacity-50"
                >
                    x
                </button>
                </div>
            </div>

            <div className="text-sm space-y-1">
                <p><span className="font-medium">Owner:</span> {product.currentOwner.slice(0, 10)}...</p>
                <p><span className="font-medium">Hash:</span> {product.characterizationHash}</p>
                <p><span className="font-medium">Creado:</span> {new Date(Number(product.timestamp) * 1000).toLocaleString()}</p>
            </div>

            {isOwner && (
                <div className="flex gap-2 pt-2 border-t">
                    {!showTransfer ? (
                        <>
                            <button
                                onClick={() => setShowTransfer(true)}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Transferir
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? 'Borrando...' : 'Borrar'}
                            </button>
                        </>
                    ) : (
                        <div className="flex-1 space-y-2">
                            <input
                                type="text"
                                value={newOwner}
                                onChange={(e) => setNewOwner(e.target.value)}
                                placeholder="0x..."
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleTransfer}
                                    disabled={isTransferring || !newOwner}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isTransferring ? 'Transfiriendo...' : 'Confirmar'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowTransfer(false)
                                        setNewOwner('')
                                    }}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                    <ConfirmDeleteModal
                        isOpen={showConfirm}
                        onCancel={cancelDelete}
                        onConfirm={confirmDelete}
                    />
                </div>
            )}
        </div>
    )
}