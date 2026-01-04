// hooks/useGetProductFromDB.ts
'use client'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ProductDB } from '@/types/product'
import { getProductFromDB } from '@/services/productApi'

export function useGetProductFromDB(productId?: string | null ) {

    const [productDB, setProductDB] = useState<ProductDB | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { address } = useAccount()

    useEffect(() => {
        if (!productId) {
            setProductDB(null)
            setError(null)
            return
        }

        const loadData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const data = await getProductFromDB(productId)
                setProductDB(data)

                if (!data) {
                    setError("Producto no encontrado en BD")
                }
            } catch (err: Error | unknown) {
                console.error("Error en useGetProductFromDB:", err)
                setError(err instanceof Error ? err.message : "Error de conexión")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [productId]) // Hace que se ejecute cada vez que cambia el ID
    const isOwner = productDB && address
        ? productDB.currentOwner.toLowerCase() === address.toLowerCase()
        : false

    return {
        productDB,
        isLoading,
        error,
        isOwner
    }
}