import useGetProductListFromDB from '@/hooks/api/useGetProductListFromDB' // Tu hook de DB
import { useProductEventsVerifier } from '@/hooks/blockchain/useProductEventsVerifier'
import { OperationResultWithID } from '@/types/operations'
import { ProductDB } from '@/types/product'
import { Event } from '@/types/events'

export function useProductDashboardLogic() {
    console.log("RENDERIZANDO...", useProductDashboardLogic)
    const { productListDB, setProductListDB, isLoading, error, refecth} = useGetProductListFromDB()

    // Confirmamos los datos actuales desde el evento en blockchai
    const handleBlockchainEvent = (data: Partial<Event>) => {

        setProductListDB((prevList: ProductDB[]) => {
            return prevList.map(product => {
                // Busca si el evento corresponde al producto, asegurando el match con Number
                if (Number(product.blockchainId) === Number(data.productBlockchainId)) {

                    if ((data.type === 'TRANSFERRED' || data.type === 'CREATED') && data.toAddress) {

                        // Si el dueño visual coincide con el del evento -> VERIFICADO
                        if (product.currentOwner?.toLowerCase() === data.toAddress.toLowerCase()) {
                            return {
                                ...product,
                                isVerified: true
                            }
                        }
                        // Si no coincidía, actualiza a la fuerza
                        return {
                            ...product,
                            currentOwner: data.toAddress,
                            isVerified: true
                        }
                    }

                    if (data.type === 'DELETED') {
                        return {
                            ...product,
                            currentOwner: product.currentOwner,
                            active: false,
                            isVerified: true
                        }
                    }
                }
                return product
            })
        })
    }
    // Activa el escuchador de eventos
    useProductEventsVerifier(
        () => { }, // Callback visual vacío
        handleBlockchainEvent // Pasa la lógica de actualización
    )

    // Lógica Optimista: Datos guardados antes de la confirmación desde blockchain
    const handleOptimisticUpdate = (type: 'TRANSFER' | 'DELETE', data: OperationResultWithID) => {
        setProductListDB((prevList: ProductDB[]) => {
            return prevList.map(product => {
                // Buscamos por el ID de blockchain
                if (String(product.blockchainId) === String(data.id)) {

                    // Actualización inmediata (Optimista)
                    if (type === 'TRANSFER' && 'newOwner' in data) {
                        return {
                            ...product,
                            currentOwner: data.newOwner,
                            isVerified: false
                        }
                    }

                    if (type === 'DELETE') {
                        return {
                            ...product,
                            currentOwner: product.currentOwner,
                            active: false,
                            isVerified: false
                        }
                    }
                }
                return product
            })
        })
    }

    const addNewProductToState = (newProduct: ProductDB) => {
        setProductListDB((prevList) => [...prevList, newProduct])
    }

    return {
        productListDB,
        handleOptimisticUpdate,
        // addNewProductToState,
        refecth,
        isLoading,
        error
    }
}