// hooks/useGetProductFromDB.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Event } from '@/types/events'
import { getEventListFromDB } from '@/services/productApi'
import { getErrorMessage } from '@/utils/errorUtils'

export function useGetEventListFromDB(productId: string) {

    const [eventListDB, setEventListDB] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        if (!productId) {
            setEventListDB([])
            setError(null)
        }
        setIsLoading(true)
        setError(null)
        try {
            const data = await getEventListFromDB(productId)
            setEventListDB(data || [])

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
    }, [productId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        eventListDB,
        isLoading,
        error,
        refetch: fetchData
    }
}