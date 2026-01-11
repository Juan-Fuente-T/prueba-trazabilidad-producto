'use client'
import { useState } from 'react'
import ProductCard from './ProductCard'
import { useGetProduct } from '@/hooks/blockchain/useGetProduct'

export default function ProductSearch() {
    const [searchId, setSearchId] = useState('')
    const [queriedId, setQueriedId] = useState<bigint | undefined>()

    const { product, isLoading, error, refetch } = useGetProduct(queriedId)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchId) setQueriedId(BigInt(searchId))
    }

    const handleClose = () => {
        setQueriedId(undefined)
        setSearchId('')
    }

    return (
        <div className="w-full space-y-8">
            {/* Barra de Búsqueda */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 flex items-center w-full mx-auto focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <span className="pl-4 text-stone-400">🔍</span>
                <input
                    type="number"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Buscar producto por ID (ej: 1)"
                    className="w-2/3 sm:w-full flex-grow p-3 text-xs sm:text-lg bg-transparent outline-none text-stone-700 placeholder-stone-400"
                    min={1}
                />
                <button
                    onClick={handleSearch}
                    disabled={!searchId}
                    className={`px-2 md:px-6 py-2 text-sm md:text-lg rounded-lg font-medium transition-colors ${searchId === '' ? 'bg-stone-300 text-stone-500 cursor-not-allowed' // Estilo deshabilitado
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                >
                    Buscar
                </button>
            </div>

            {/* Renderizado Condicional del Resultado */}
            {isLoading && <div className="text-center py-8"><div className="animate-spin text-4xl">⏳</div><p className="mt-2 text-stone-500">Consultando Blockchain...</p></div>}

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">❌ Producto no encontrado en el registro.</div>}

            {queriedId && product && (
                <div className="animate-fade-in-up">
                    <ProductCard product={product} productId={queriedId} onClose={handleClose} onRefetch={refetch}/>
                </div>
            )}
        </div>
    )
}