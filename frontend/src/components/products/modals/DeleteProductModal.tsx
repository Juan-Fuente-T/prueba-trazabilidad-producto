'use client'

import { useEffect, useRef } from 'react'
import Modal from '../../ui/Modal'
import ProductInfoCard from '@/components/products/modals/ProductInfoCard'
import { useProductDeleteLogic } from '@/hooks/orchestration/useProductDeleteLogic'
import { ActionModalProps } from '@/types/operations';

export default function DeleteProductModal({ isOpen, onClose, preFilledId, onSuccess, onOptimisticDelete, onRollback }: ActionModalProps) {
    const {
        product,
        productDB,
        isOwner,
        productId,
        txHash,
        setProductId,
        handleSubmit,
        status,
        errors
    } = useProductDeleteLogic({
        onOptimisticDelete:onOptimisticDelete,
        onSuccess: onClose,
        onRollback: (id) => {
            if (onRollback) onRollback(id, 'delete')
        }
    })

    //Util para evitar notificaciones duplicadas y re-renderizados de estas
    const hasNotifiedRef = useRef(false)

    useEffect(() => {
        // Si está abierto y ha llegado un ID prefijado, se asigna.
        if (isOpen) {
            hasNotifiedRef.current = false
            if (preFilledId) {
                setProductId(preFilledId)
            } else {
                setProductId('')
            }
        }
    }, [isOpen, preFilledId])

    useEffect(() => {
        if (status.isSuccess && !hasNotifiedRef.current) {
            hasNotifiedRef.current = true
            // Si el modal sigue abierto (fallo de optimist UI), esto asegura el cierre final.
            onSuccess({ txHash: txHash || "0xHashNoDisponible" })
        }
        // }, [status.isSuccess, status.isTransferingDB, onSuccess, onClose])
    }, [status.isSuccess, onSuccess])

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
                    loadingDB={status.loadingDB}
                    isLoadingBlockchain={status.loadingBC}
                    isOwner={isOwner}
                    variant="default"
                    minHeight="130px"
                />

                {/* Mensajes Éxito/Error Acción */}
                {status.isSuccess ? (
                    <p className="text-green-600 font-bold text-center bg-green-50 p-3 rounded border border-green-200">
                        🗑️ Lote eliminado correctamente.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {(errors.deleteError || (errors.readError && !errors.readError.message.includes("reverted"))) && (
                            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-200 break-words">
                                {/* Error: {errors.deleteError?.message || errors.readError?.message || errors.readErrorDB || errors.errorDB} */}
                                Error: {errors.readError?.message || errors.readErrorDB }
                            </p>
                        )}
                    </div>
                )}

                {/* Botón borrado*/}
                <button
                    type="submit"
                    className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                    disabled={!isOwner || !product || status.isPending || status.isConfirming }
                >
                    {status.isPending || status.isConfirming ? 'Solicitando Confirmación...' : 'Confirmar Borrado'}
                </button>
            </form>
        </Modal>
    )
}