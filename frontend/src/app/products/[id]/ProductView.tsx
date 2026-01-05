'use client' // CLAVE. Habilita los Hooks.

import { useMemo, useCallback } from 'react'
import { useGetProductFromDB } from '@/hooks/api/useGetProductFromDB'
import { useGetEventListFromDB } from '@/hooks/api/useGetEventListFromDB'

import ProductDetailCard from '@/components/products/ProductDetailCard'
import Header from '@/components/layout/Header' // Ajusta tus imports
import ProductNavigation from '@/components/products/ProductNavigation' // Ajusta tus imports
import Link from 'next/link'

interface Props {
    productId: string
}

export default function ProductView({ productId}: Props) {
    const numericId = useMemo(() => Number(productId), [productId])

    const { productDB, isLoading, refetch: refetchProduct } = useGetProductFromDB(productId)
    const { eventListDB, refetch: refetchEvents } = useGetEventListFromDB(productId)

    const handleUpdateData = useCallback(() => {
        console.log("🔄 Producto modificado (transferido o borrado), recargando...")
        refetchProduct()
        refetchEvents()
    }, [refetchProduct, refetchEvents])

    if (isLoading && !productDB) {
        return <div className="mt-20 text-center">Cargando producto...</div>
    }

    if (!productDB) {
        return (
            <div className="min-h-screen bg-stone-50 mt-20">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <ProductNavigation currentId={numericId} />
                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-stone-800 mb-2">Producto no encontrado</h2>
                            <p className="text-stone-500 mb-6">
                                El producto <strong>#{numericId}</strong> no existe o no ha sido registrado aún.
                            </p>
                            <Link href="/" className="text-emerald-600 font-medium border border-emerald-600 rounded-md px-2 py-1.5 hover:underline ">
                                Ir al listado principal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-stone-50 pb-10 mt-20">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <ProductNavigation currentId={numericId} />
                {/* Pasamos productDB asegurando que no es null (ya lo validamos arriba) */}
                <ProductDetailCard productDB={productDB} eventListDB={eventListDB} onDataUpdate={handleUpdateData}/>
            </div>
        </main>
    )
}