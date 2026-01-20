import useGetProductListFromDB from '@/hooks/api/useGetProductListFromDB' // Tu hook de DB
import { useProductEventsVerifier } from '@/hooks/blockchain/useProductEventsVerifier'
import { OperationResultWithID } from '@/types/operations'
import { ProductUI } from '@/types/product'
import { Event } from '@/types/events'

export function useProductDashboardLogic() {
    const { productListDB, setProductListDB, isLoading, error, refecth} = useGetProductListFromDB()

    // Confirmamos los datos actuales desde el evento en blockchain
    const handleBlockchainEvent = (data: Partial<Event>) => {

        setProductListDB((prevList: ProductUI[]) => {
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
        setProductListDB((prevList) => {
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

    // Función para añadir el producto visualmente al instante
    const handleOptimisticCreate = (newProduct: ProductUI) => {
        // Al crear, entra como NO verificado por defecto
        const visualProduct: ProductUI = {
            ...newProduct,
            isVerified: false
        }
        setProductListDB((prevList) => [visualProduct, ...prevList])
    }
    // Función para deshacer si falla la transacción(Rollback)
    const handleRollback = (id: string | number, type: 'create' | 'update' | 'delete') => {
        setProductListDB((prevList) => {
            if (type === 'create') {
                return prevList.filter(p => String(p.blockchainId) !== String(id))
            }

            // CASO 2 y 3 (Update/Delete):
            // Como tu 'handleOptimisticUpdate' ya modifica el estado, para revertir
            // se necesita la data original. De momento, si falla un Transfer, el usuario
            // verá el estado "No verificado" hasta que recargue o llegue el evento real.
            return prevList
        })
    }

    // const addNewProductToState = (newProduct: ProductUI) => {
    //     setProductListDB((prevList) => [...prevList, newProduct])
    // }

    return {
        productListDB,
        handleOptimisticUpdate,
        // addNewProductToState,
        refecth,
        optimisticActions: {
            create: handleOptimisticCreate,
            update: handleOptimisticUpdate,
            rollback: handleRollback
        },
        isLoading,
        error
    }
}