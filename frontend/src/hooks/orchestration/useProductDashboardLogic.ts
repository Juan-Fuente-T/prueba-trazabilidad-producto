import useGetProductListFromDB from '@/hooks/api/useGetProductListFromDB'
import { useProductEventsVerifier } from '@/hooks/blockchain/useProductEventsVerifier'
import { ProductUI } from '@/types/product'
import { Event } from '@/types/events'

export function useProductDashboardLogic() {
    const { productListDB, setProductListDB, isLoading, error, refecth } = useGetProductListFromDB()

    // Confirma los datos actuales desde el evento en blockchain
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
                        // Si no coincide, actualiza a la fuerza
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
    const optimisticTransfer = (data: { id: string | number, newOwner: string }) => {
        setProductListDB((prev) => prev.map(p => {
            if (String(p.blockchainId) === String(data.id)) {
                return {
                    ...p,
                    currentOwner: data.newOwner,
                    isVerified: false
                }
            }
            return p
        }))
    }
    // Función para eliminar el producto visualmente al instante
    const optimisticDelete = (id: string | number) => {
        setProductListDB((prev) => prev.map(p => {
            if (String(p.blockchainId) === String(id)) {
                return {
                    ...p,
                    active: false,
                    isVerified: false
                }
            }
            return p
        }))
    }
    // Función para añadir el producto visualmente al instante
    const optimisticCreate = (newProduct: ProductUI) => {
        // Al crear, entra como NO verificado por defecto
        const visualProduct: ProductUI = {
            ...newProduct,
            isVerified: false
        }
        setProductListDB((prevList) => [visualProduct, ...prevList])
    }
    // Función para deshacer si falla la transacción(Rollback)
    const optimisticRollback = (id: string | number, type: 'create' | 'transfer' | 'delete') => {

        // Si es CREATE (aún no existe en BD), se borra de la lista visualmente
        if (type === 'create') {
            setProductListDB((prev) => prev.filter(p => String(p.blockchainId) !== String(id)))
            return;
        }
        // Si es TRANSFER o DELETE (ya existía en BD) Se pide a la BD los datos reales de nuevo.
        refecth();
    }

    return {
        productListDB,
        refecth,
        isLoading,
        error,
        optimisticActions: {
            create: optimisticCreate,
            transfer: optimisticTransfer,
            delete: optimisticDelete,
            rollback: optimisticRollback
        }
    }
}