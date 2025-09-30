'use client'

import { useState } from 'react'
import Modal from './Modal'

export default function TransferProductModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [productId, setProductId] = useState('')
    const [isOwner, setIsOwner] = useState(false)
    const [newOwner, setNewOwner] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí se llama al hook useTransferProduct
        console.log('Transfer product:', { productId, newOwner })
        setIsOpen(false)
        setProductId('')
        setNewOwner('')
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
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
                    {!isOwner && (
                        //   <p className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
                        <p className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                            No es posible realizar la operación. Solo el dueño puede transferir el producto.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isOwner}
                    >
                        Transfer Ownership
                    </button>
                </form>
            </Modal>
        </>
    )
}