'use client'

import { useState } from 'react'
import { useGetProduct } from '@/hooks/useGetProduct'
import ProductCard from './ProductCard'

export default function ProductSearch() {
    const [searchId, setSearchId] = useState('')
    const [queriedId, setQueriedId] = useState<bigint>()

    const { product, isLoading, error } = useGetProduct(queriedId)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchId) {
            setQueriedId(BigInt(searchId))
        }
    }

    const handleClose = () => {
        setQueriedId(undefined) // Limpia el ID
        setSearchId('') // Limpia el input también
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Buscar Producto</h2>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="number"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="ID del producto"
                    className="flex-1 border rounded px-3 py-2"
                    min={1}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Buscar
                </button>
            </form>

            {isLoading && <p className="text-gray-500">Buscando...</p>}

            {error && (
                <p className="text-red-600">Error: Producto no encontrado</p>
            )}

            {product && queriedId && (
                <ProductCard productId={queriedId} product={product} onClose={handleClose} />
            )}
        </div>
    )
}