'use client'
import { useState } from 'react'
import ProductCard from './ProductCard' // Crearemos este componente mejorado abajo
// import { useGetProduct } from '@/hooks/useGetProduct' 

export default function ProductSearch() {
    const [searchId, setSearchId] = useState('')
    const [queriedId, setQueriedId] = useState<bigint | undefined>()

    // Mock de datos para diseño (luego descomenta tu hook real)
    // const { product, isLoading, error } = useGetProduct(queriedId)

    // MOCK TEMPORAL PARA VER EL DISEÑO SIN BLOCKCHAIN
    const mockProduct = queriedId ? {
        quantity: BigInt(50),
        characterizationHash: "0x7f9a8d7e6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a" as `0x${string}`,
        // currentOwner: "0xE509E7039bd8D78518822B5cBE80E93D84D2c452" as `0x${string}`,
        currentOwner: "0xe67F18c5064f12470Efc943798236edF45CF3Afb" as `0x${string}`,
        timestamp: BigInt(Math.floor(Date.now() / 1000)),
        exists: true
    } : null;

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
            {/* Barra de Búsqueda Estilo "Google" */}
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
            {/* {isLoading && <div className="text-center py-8"><div className="animate-spin text-4xl">⏳</div><p className="mt-2 text-stone-500">Consultando Blockchain...</p></div>} */}

            {/* {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-100">❌ Producto no encontrado en el registro.</div>} */}

            {/* Aquí usamos el nuevo componente ProductCard visualmente rico */}
            {queriedId && mockProduct && (
                <div className="animate-fade-in-up">
                    <ProductCard product={mockProduct} productId={queriedId} onClose={handleClose} />
                </div>
            )}
        </div>
    )
}