// hooks/useGetProductFromDB.ts
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { ProductUI } from '@/types/product'
import { getProductFromDB } from '@/services/productApi'

export function useGetProductFromDB(productId?: string | null) {

    const [productDB, setProductDB] = useState<ProductUI | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { address } = useAccount()

    const fetchData = useCallback(async () => {
        if (!productId) {
            setProductDB(null)
            setError(null)
            return
        }

        setIsLoading(true)
        setError(null)
        try {
            const data = await getProductFromDB(productId)
            setProductDB(data)

            if (!data) {
                setError("Lote no encontrado en BD")
            }
        } catch (err: Error | unknown) {
            console.error("Error en useGetProductFromDB:", err)
            setError(err instanceof Error ? err.message : "Error de conexión")
        } finally {
            setIsLoading(false)
        }
    }, [productId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const isOwner = productDB && address
        ? productDB.currentOwner.toLowerCase() === address.toLowerCase()
        : false

    return {
        productDB,
        isLoading,
        error,
        isOwner,
        refetch: fetchData,
        setProductDB
    }
}