import { useState } from 'react'
import { saveProductToDB } from '@/services/productApi'
import { ProductPayload } from '@/types/product'
import { getErrorMessage } from '@/utils/errorUtils'

export function useSaveProductToDB() {
    const [isSavingDB, setIsSavingDB] = useState(false)
    const [errorDB, setErrorDB] = useState<string | null>(null)
    const [isSuccessDB, setIsSuccessDB] = useState(false)

    const saveToDB = async (productData: ProductPayload) => {
        setIsSavingDB(true)
        setErrorDB(null)
        try {
            await saveProductToDB(productData)
            setIsSuccessDB(true)
        } catch (e: unknown) {
            console.error(e)
            const message = getErrorMessage(e)
            setErrorDB(message)
            throw e // Relanza para que el modal sepa que falló
        } finally {
            setIsSavingDB(false)
        }
    }

    return {
        saveToDB,
        isSavingDB,
        isSuccessDB,
        errorDB,
        resetDBStatus: () => { setIsSuccessDB(false); setErrorDB(null); setIsSavingDB(false) }
    }
}