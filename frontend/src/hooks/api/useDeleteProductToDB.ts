import { useState } from 'react'
import { deleteProductToDB } from '@/services/productApi'
import { DeleteProductPayload } from '@/types/product'
import { getErrorMessage } from '@/utils/errorUtils'

export function useDeleteProductToDB() {
    const [isDeletingDB, setIsDeletingDB] = useState(false)
    const [errorDB, setErrorDB] = useState<string | null>(null)
    const [isSuccessDB, setIsSuccessDB] = useState(false)

    const deleteToDB = async (productData: DeleteProductPayload) => {
        setIsDeletingDB(true)
        setErrorDB(null)
        try {
            await deleteProductToDB(productData)
            setIsSuccessDB(true)
        } catch (e) {
            console.error(e)
            const message = getErrorMessage(e)
            setErrorDB(message)
            throw e // Relanza para que el modal sepa que falló
        } finally {
            setIsDeletingDB(false)
        }
    }

    return {
        deleteToDB,
        isDeletingDB,
        isSuccessDB,
        errorDB,
        resetDBStatus: () => { setIsSuccessDB(false); setErrorDB(null); setIsDeletingDB(false) }
    }
}