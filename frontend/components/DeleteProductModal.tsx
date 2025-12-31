'use client'

import { useEffect, useState } from 'react'
import Modal from './Modal'
import { useGetProduct } from '@/hooks/useGetProduct'
import { useDeleteProduct } from '@/hooks/useDeleteProduct'
import { getRoleName } from '@/utils/roleUtils'
import { shortenAddress } from '@/utils/formatters'

interface DeleteProductModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function DeleteProductModal({ isOpen, onClose }: DeleteProductModalProps) {
    const [productId, setProductId] = useState('')
    // const [showError, setShowError] = useState(false)
    const [dbProductName, setDbProductName] = useState<string>('')
    const [isSearchingDb, setIsSearchingDb] = useState(false)

    const { product, isOwner, isLoading, error: readError } = useGetProduct(
        productId && productId.trim() !== '' ? BigInt(productId) : undefined
    )
    const { deleteProduct, isPending, isConfirming, isSuccess, error: deleteError } = useDeleteProduct()

    // Limpieza al cerrar
    useEffect(() => {
        if (!isOpen) {
            setProductId('')
            setDbProductName('')
        }
    }, [isOpen])

    // Timer éxito
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => onClose(), 3000)
            return () => clearTimeout(timer)
        }
    }, [isSuccess, onClose])

    useEffect(() => {
        const fetchProductName = async () => {
            if (!productId) {
                setDbProductName('')
                return
            }
            setIsSearchingDb(true)
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${productId}`)

                if (response.ok) {
                    const resp = await response.json()
                    console.log("PRODUCTO MONGO", resp)
                    setDbProductName(resp.data.name || "Sin nombre en BD")
                } else if (response.status === 404) {
                    setDbProductName("No registrado en BD")
                } else {
                    setDbProductName("Error servidor")
                }
            } catch (error) {
                console.error("Error buscando el nombre:", error)
                setDbProductName("Error conexión BD")
            } finally {
                setIsSearchingDb(false)
            }
        }

        // Debounce simple: espera 500ms a que se deje de escribir para no saturar
        const timeoutId = setTimeout(() => {
            if (productId) fetchProductName()
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [productId])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("productId", productId);

        if (!isOwner) return // Validación dueño del producto
        //Todo: validar que el id no se de un producto ya borrado
        deleteProduct(BigInt(productId))
    }

    const roleLabel = product ? getRoleName(product.currentOwner) : "Desconocido"

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
                <div className="min-h-[160px] flex items-center justify-center border border-stone-800 rounded-md">
                    {productId && product && (
                        <div className="w-full bg-rose-50 border border-rose-100 rounded p-4 text-sm shadow-sm">
                            <p className="font-bold text-rose-800 border-b border-rose-200 pb-2 mb-2">
                                ⚠️ Vas a eliminar permanentemente:
                            </p>

                            <div className="grid grid-cols-[80px_1fr] gap-y-1 text-gray-700">
                                {/* 🔥 CAMBIO 3: MOSTRAMOS EL NOMBRE DE MONGO */}
                                <span className="font-semibold text-gray-500">Nombre:</span>
                                <span className="font-bold text-gray-900">
                                    {isSearchingDb ? "Cargando..." : dbProductName || "(Desconocido)"}
                                </span>

                                <span className="font-semibold text-gray-500">ID:</span>
                                <span>{productId}</span>

                                <span className="font-semibold text-gray-500">Estado:</span>
                                <span>{roleLabel}</span>

                                <span className="font-semibold text-gray-500">Dueño:</span>
                                <span className="font-mono text-xs pt-0.5">{shortenAddress(product.currentOwner)}</span>
                            </div>

                            {!isOwner && (
                                <div className="mt-3 bg-red-100 text-red-700 p-2 rounded text-center text-xs font-bold">
                                    ⛔ NO ERES EL DUEÑO. ACCESO DENEGADO.
                                </div>
                            )}
                        </div>
                    )}
                    {/* Errores de lectura */}
                    {productId && !product && !isLoading && (
                        <p className="w-fit p-4 text-red-500 text-xl font-bold text-center bg-red-50 rounded-md">❌ El producto ID {productId} no existe en Blockchain</p>
                    )}
                </div>


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

                {/* Botón */}
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