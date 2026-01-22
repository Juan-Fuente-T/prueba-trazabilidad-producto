import useGetProductListFromDB from '@/hooks/api/useGetProductListFromDB'
import { useProductEventsVerifier } from '@/hooks/blockchain/useProductEventsVerifier'
import { usePendingHashVerifier } from '@/hooks/orchestration/usePendingHashVerifier'
import { ProductUI } from '@/types/product'
import { Event } from '@/types/events'

export function useProductDashboardLogic() {
    const { productListDB, setProductListDB, isLoading, error, refecth } = useGetProductListFromDB()

    // Confirma los datos actuales desde el evento en blockchain
    const handleBlockchainEvent = (data: Partial<Event> & { txHash: string }) => {
        setProductListDB((prevList: ProductUI[]) => {
            return prevList.map(product => {
                // Busca si el evento corresponde al producto, asegurando el match con Number
                if (Number(product.blockchainId) === Number(data.productBlockchainId)) {

                    if (product.pendingTxHash) {
                        // ...y el hash del evento NO coincide, no hacemos nada (es un evento viejo o de otro)
                        if (product.pendingTxHash !== data.txHash) {
                            return product;
                        }
                    }

                    if ((data.type === 'TRANSFERRED' || data.type === 'CREATED') && data.toAddress) {

                        // Si el dueño visual coincide con el del evento -> VERIFICADO
                        if (product.currentOwner?.toLowerCase() === data.toAddress.toLowerCase()) {
                            return {
                                ...product,
                                isVerified: true,
                                pendingTxHash: undefined
                            }
                        }
                        // Si no coincide, actualiza a la fuerza
                        return {
                            ...product,
                            currentOwner: data.toAddress,
                            isVerified: true,
                            pendingTxHash: undefined
                        }
                    }

                    if (data.type === 'DELETED') {
                        return {
                            ...product,
                            currentOwner: product.currentOwner,
                            active: false,
                            isVerified: true,
                            pendingTxHash: undefined
                        }
                    }
                }
                return product
            })
        })
    }
    // ---------------------------------------------------------
    // ESCUCHADOR DE EVENTOS (FRONTEND)
    // ---------------------------------------------------------
    // NOTA: Este hook utiliza internamente 'wagmi' (useWatchContractEvent).
    // Wagmi implementa su propio 'useEffect' que se monta automáticamente
    // al invocar la función. Mantiene una suscripción WebSocket/RPC activa
    // mientras este componente permanezca montado en el árbol de React.
    // No requiere un useEffect adicional ni un botón de arranque.
    useProductEventsVerifier(
        () => { }, // Callback visual vacío
        handleBlockchainEvent // Pasa la lógica de actualización
    )

    // -----------------------------------------------------------------------
    //FILTRADO: Obtiene TODOS los productos que están esperando vefificación
    // -----------------------------------------------------------------------
    const pendingProducts = productListDB
        .filter(p => p.pendingTxHash && p.blockchainId)
        .map(p => ({
            id: p.blockchainId,
            hash: p.pendingTxHash! // El ! asegura que existe porque filtramos antes
        }));

    // -----------------------------------------------------------------------
    // ACTIVACIÓN DEL ESCUCHADOR PARA VERIFICACIONES PENDIENTES
    // -----------------------------------------------------------------------
    usePendingHashVerifier({
        pendingItems: pendingProducts,
        onItemVerified: (verifiedId) => {
            setProductListDB(prev => prev.map(p => {
                if (String(p.blockchainId) === String(verifiedId)) {
                    return {
                        ...p,
                        isVerified: true,
                        pendingTxHash: undefined
                    }
                }
                return p
            }))
        }
    })

    // -----------------------------------------------------------------------
    // ACTUALIZACIÓN DE HASH PENDIENTE
    // -----------------------------------------------------------------------
    const attachPendingHash = (id: string | number, txHash: string) => {
        console.log(`🔌 Hash ${txHash} acoplado al producto ${id}`);
        setProductListDB((prev) => prev.map(p => {
            if (String(p.blockchainId) === String(id)) {
                return { ...p, pendingTxHash: txHash }
            }
            return p
        }))
    }

    // Lógica Optimista: Datos guardados antes de la confirmación desde blockchain
    const optimisticTransfer = (data: { id: string | number, newOwner: string }) => {
        setProductListDB((prev) => prev.map(p => {
            if (String(p.blockchainId) === String(data.id)) {
                return {
                    ...p,
                    currentOwner: data.newOwner,
                    isVerified: false,
                    // pendingTxHash: data.txHash
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
                    isVerified: false,
                    // pendingTxHash: txHash
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
            isVerified: false,
            // pendingTxHash: txHash
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
            rollback: optimisticRollback,
            attachHash: attachPendingHash
        }
    }
}