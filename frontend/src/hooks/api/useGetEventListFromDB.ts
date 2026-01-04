// hooks/useGetProductFromDB.ts
'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/types/events'
import { getEventListFromDB } from '@/services/productApi'
import { getErrorMessage } from '@/utils/errorUtils'

export default function useGetProductListFromDB(productId: string) {

    const [eventListDB, setEventListDB] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
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
        }

        loadData()
    }, [productId])

    return {
        eventListDB,
        isLoading,
        error
    }
}