'use client'

import { useEffect } from 'react'
import Modal from '../../ui/Modal'
import ProductInfoCard from '@/components/products/ProductInfoCard'
import RoleSelectorButtons from '@/components/products/modals/RoleSelectorButtons'
import { useProductTransferLogic } from '@/hooks/useProductTransferLogic'

interface TransferProductModalProps {
    isOpen: boolean
    onClose: () => void
    preFilledId?: string
}

export default function TransferProductModal({ isOpen, onClose, preFilledId }: TransferProductModalProps) {
const {
        product,
        productDB,
        isOwner,
        productId,
        newOwner,
        setProductId,
        setNewOwner,
        handleSubmit,
        status,
        errors
    } = useProductTransferLogic()

    useEffect(() => {
        // Si está abierto y ha llegado un ID prefijado, se asigna.
        if (isOpen && preFilledId) {
            setProductId(preFilledId)
        } else {
            setProductId('')
        }
    }, [isOpen, preFilledId])

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
                    loadingDB={status.loadingDB}
                    isLoadingBlockchain={status.loadingBC}
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
                {(errors.writeError || (errors.readError && !errors.readError.message.includes("reverted"))) && (
                    <div className="bg-red-50 p-2 rounded border border-red-200">
                        <p className="text-red-600 text-xs text-center break-words">
                            Error: {errors.writeError?.message || errors.readError?.message || errors.readErrorDB || errors.errorDB}
                        </p>
                    </div>
                )}

                {status.isSuccess && <p className="text-green-600 font-bold text-center">✅ Transferencia completada</p>}

                {/* BOTÓN TRANSFERENCIA */}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    disabled={!productId || !newOwner || !isOwner || status.isPending || status.isConfirming || status.isTransferingDB}
                >
                    {status.isPending || status.isConfirming || status.isTransferingDB ? 'Procesando...' : 'Transferir Propiedad'}
                </button>

            </form>
        </Modal>
    )
}