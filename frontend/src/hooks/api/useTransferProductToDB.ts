import { useState } from 'react'
import { transferProductToDB } from '@/services/productApi'
import { TransferProductPayload } from '@/types/product'
import { getErrorMessage } from '@/utils/errorUtils'

export function useTransferProductToDB() {
    const [isTransferingDB, setIsTransferingDB] = useState(false)
    const [errorDB, setErrorDB] = useState<string | null>(null)
    const [isSuccessDB, setIsSuccessDB] = useState(false)

    const transferToDB = async (productData: TransferProductPayload) => {
        setIsTransferingDB(true)
        setErrorDB(null)
        try {
            await transferProductToDB(productData)
            setIsSuccessDB(true)
        } catch (e) {
            console.error(e)
            const message = getErrorMessage(e)
            setErrorDB(message)
            throw e // Relanza para que el modal sepa que falló
        } finally {
            setIsTransferingDB(false)
        }
    }

    return {
        transferToDB,
        isTransferingDB,
        isSuccessDB,
        errorDB,
        resetDBStatus: () => { setIsSuccessDB(false); setErrorDB(null); setIsTransferingDB(false) }
    }
}