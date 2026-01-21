'use client' // CLAVE. Habilita los Hooks.

import { useMemo, useCallback } from 'react'
import { useGetProductFromDB } from '@/hooks/api/useGetProductFromDB'
import { useGetEventListFromDB } from '@/hooks/api/useGetEventListFromDB'

import ProductDetailCard from '@/components/products/detail/ProductDetailCard'
import ProductNavigation from '@/components/products/detail/ProductNavigation'
import Link from 'next/link'
import { Event }  from '@/types/events'

interface Props {
    productId: string
}

export default function ProductView({ productId}: Props) {
    const numericId = useMemo(() => Number(productId), [productId])

    const { productDB, isLoading, refetch: refetchProduct, setProductDB } = useGetProductFromDB(productId)
    const { eventListDB, refetch: refetchEvents, setEventListDB  } = useGetEventListFromDB(productId)

    const handleUpdateData = useCallback((optimisticNewOwner?: string, newEvent?: Event) => {
        // SI HAY DATO NUEVO, LO PINTA AL INSTANTE (OPTIMISTIC UI)
        if (optimisticNewOwner && productDB && newEvent) {
            setProductDB({
                ...productDB,
                currentOwner: optimisticNewOwner, // Cambia el dueño de modo optimista antes de la confirmación                // Puedes añadir más campos si tu interfaz los necesita (ej: estado: 'TRANSFERRED')
            })
            setEventListDB((eventListDB) => {
                // Crea un array nuevo añadiendo el nuevo evento
                return [...eventListDB, newEvent]
            })
        }

        // DE FONDO, pide los datos reales a la BD para confirmar
        // Da un pequeño margen al backend Java para terminar de guardar
        setTimeout(() => {
            refetchProduct()
            refetchEvents()
        }, 2000)
    }, [refetchProduct, refetchEvents, productDB, setProductDB, setEventListDB])

    if (isLoading && !productDB) {
        return <div className="mt-20 mb-20 text-center text-acero-700 text-lg">Cargando lote...</div>
    }

    if (!productDB) {
        return (
            <div className="min-h-screen bg-stone-50">
                <div className="container mx-auto px-4 py-8">
                    <ProductNavigation currentId={numericId} />
                    <div className="flex flex-col items-center justify-center text-center">
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
        <main className="min-h-screen bg-stone-50">
            <div className="container mx-auto px-4 py-8">
                <ProductNavigation currentId={numericId} />
                <ProductDetailCard productDB={productDB} eventListDB={eventListDB} onDataUpdate={handleUpdateData}/>
            </div>
        </main>
    )
}