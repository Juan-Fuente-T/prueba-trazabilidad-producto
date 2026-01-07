// hooks/useGetProductFromDB.ts
'use client'
import { useState, useEffect } from 'react'
import { ProductDB } from '@/types/product'
import { getProductListFromDB } from '@/services/productApi'
import { getErrorMessage } from '@/utils/errorUtils'

export default function useGetProductListFromDB() {

    const [productListDB, setProductListDB] = useState<ProductDB[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const data = await getProductListFromDB()
                setProductListDB(data || [])

                if (!data) {
                    setError("Lista de productos no encontrado en BD")
                }
            } catch (err: Error | unknown) {
                console.error("Error en useGetProductListFromDB:", err)
                const message = getErrorMessage(err)
                setError(message)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    return {
        productListDB,
        isLoading,
        error,
        setProductListDB
    }
}