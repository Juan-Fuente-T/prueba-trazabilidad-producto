'use client'

import { useEffect, useState } from 'react'
import Modal from '../../ui/Modal'
import { useGetProduct } from '@/hooks/useGetProduct'
import { useTransferProduct } from '@/hooks/useTransferProduct'
import { SUPPLY_CHAIN_ADDRESSES } from '@/config/supplyChainRoles'
import { useGetProductFromDB } from '@/hooks/useGetProductFromDB'
import ProductInfoCard from '@/components/products/ProductInfoCard'

interface TransferProductModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function TransferProductModal({ isOpen, onClose }: TransferProductModalProps) {
    const [productId, setProductId] = useState('')
    const [newOwner, setNewOwner] = useState('')

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB } = useGetProductFromDB(idParaBuscarEnBD)

    const { transferProduct, isPending, isConfirming, isSuccess, error: writeError } = useTransferProduct()

    useEffect(() => {
        if (!isOpen) {
            setProductId('')
            setNewOwner('')
        }
    }, [isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!productId || !newOwner) return
        //Todo: validar que el id no sea de un producto ya borrado
        transferProduct(BigInt(productId), newOwner as `0x${string}`)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transferir Producto">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* INPUT ID */}
                <div>
                    <label className="block text-sm font-medium mb-1">ID del Producto</label>
                    <input
                        type="number"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ej: 1"
                        min={1}
                        required
                    />
                </div>
                {/* 🔥 COMPONENTE REUTILIZABLE (Modo Default/Azul) */}
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
                {/* SELLECCION ROL */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nuevo Destino</label>
                    <div className="flex flex-col md:flex-row gap-2">
                        <button
                            type="button"
                            onClick={() => setNewOwner(SUPPLY_CHAIN_ADDRESSES.MAYORISTA || '')}
                            disabled={!isOwner}
                            className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🏭 Mayorista
                        </button>
                        <button
                            type="button"
                            onClick={() => setNewOwner(SUPPLY_CHAIN_ADDRESSES.TRANSPORTISTA || '')}
                            disabled={!isOwner}
                            className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🚚 Transportista
                        </button>
                        <button
                            type="button"
                            onClick={() => setNewOwner(SUPPLY_CHAIN_ADDRESSES.PUNTO_VENTA || '')}
                            disabled={!isOwner}
                            className="flex-1 border rounded p-2 text-sm hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🏪 Tienda
                        </button>
                    </div>
                </div>

                {/* INPUT MANUAL DE ADDRESS*/}
                <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full border-b border-gray-300 py-1 text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="O dirección manual (0x...)"
                    required
                />

                {/* MOSTRAR ERRORES */}
                {/* Filtra error de lectura, "revert", que ya se esta gestionando*/}
                {(writeError || (readError && !readError.message.includes("reverted"))) && (
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                        <p className="text-red-600 text-xs text-center break-words">
                            Error: {writeError?.message || readError?.message}
                        </p>
                    </div>
                )}

                {isSuccess && <p className="text-green-600 font-bold text-center">✅ Transferencia completada</p>}

                {/* BOTÓN TRANSFERENCIA */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    disabled={!productId || !newOwner || !isOwner || isPending || isConfirming}
                >
                    {isPending || isConfirming ? 'Procesando...' : 'Transferir Propiedad'}
                </button>

            </form>
        </Modal>
    )
}