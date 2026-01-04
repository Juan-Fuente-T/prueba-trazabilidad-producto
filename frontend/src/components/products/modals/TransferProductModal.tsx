'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '../../ui/Modal'
import { useGetProduct } from '@/hooks/useGetProduct'
import { useTransferProduct } from '@/hooks/useTransferProduct'
import { useGetProductFromDB } from '@/hooks/useGetProductFromDB'
import ProductInfoCard from '@/components/products/ProductInfoCard'
import RoleSelectorButtons from '@/components/products/modals/RoleSelectorButtons'

interface TransferProductModalProps {
    isOpen: boolean
    onClose: () => void
    preFilledId?: string
}

export default function TransferProductModal({ isOpen, onClose, preFilledId }: TransferProductModalProps) {
    const [productId, setProductId] = useState('')
    const [newOwner, setNewOwner] = useState('')
    const router = useRouter()

    const { product, isOwner, isLoading: loadingBC, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )

    // Solo llama a BD si existe el producto en blockchain
    const idParaBuscarEnBD = product ? productId : null;
    const { productDB, isLoading: loadingDB } = useGetProductFromDB(idParaBuscarEnBD)

    const { transferProduct, isPending, isConfirming, isSuccess, error: writeError } = useTransferProduct()

    useEffect(() => {
        // Si está abierto y ha llegado un ID prefijado, se asigna.
        if (isOpen && preFilledId) {
            setProductId(preFilledId)
        } else {
            setProductId('')
        }
    }, [isOpen, preFilledId])

    useEffect(() => {
        if (isSuccess) {
            router.refresh() // Refrescamos la lista
        }
    }, [isSuccess])
    // useEffect(() => {
    //     if (isSuccess) {
    //         router.refresh() // Refrescamos la lista
    //         const timer = setTimeout(() => {
    //             setNewOwner('') // Limpiamos el form
    //             onClose()
    //         }, 2500)
    //         return () => clearTimeout(timer)
    //     }
    // }, [isSuccess, onClose])

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
                <RoleSelectorButtons
                    isOwner={!!isOwner}
                    onSelect={(addr) => setNewOwner(addr)}
                />

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