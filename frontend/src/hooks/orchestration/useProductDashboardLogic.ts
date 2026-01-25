import { useEffect } from 'react';
import useGetProductListFromDB from '@/hooks/api/useGetProductListFromDB'
import { useProductEventsVerifier } from '@/hooks/blockchain/useProductEventsVerifier'
import { usePendingHashVerifier } from '@/hooks/orchestration/usePendingHashVerifier'
import { useProductCreationStore } from '@/store/useProductCreationStore'
import { ProductUI } from '@/types/product'
import { Event } from '@/types/events'

export function useProductDashboardLogic() {
    const { productListDB, setProductListDB, isLoading, error, refetch } = useGetProductListFromDB()
    const lastLocalProductUpdate = useProductCreationStore(state => state.lastLocalProductUpdate);
    const removePendingVerification = useProductCreationStore(s => s.removePendingVerification);
    const refreshTrigger = useProductCreationStore(state => state.refreshTrigger);

    // -----------------------------------------------------------------------
    // ACTUALIZACIÓN LOCAL UNIFICADA
    // Actualizar el producto de la optimisc UI con los cambios de la blockchain
    // -----------------------------------------------------------------------
    useEffect(() => {
        if (lastLocalProductUpdate) {
            setProductListDB((prevList) => prevList.map(product => {
                // Comparamos IDs como String para seguridad (TempId suele ser string, ID real number)
                if (String(product.blockchainId) === String(lastLocalProductUpdate.targetId)) {
                    // Aplica los cambios que vengan. Si es Creación: Cambiará blockchainId, isVerified, y hash.
                    // Si es Borrado: Cambiará active a false. Si es Transfer: Cambiará currentOwner.
                    return {
                        ...product,
                        ...lastLocalProductUpdate.changes
                    };
                }
                return product;
            }));
        }
    }, [lastLocalProductUpdate, setProductListDB]);


    // -----------------------------------------------------------------------
    // ESTRATEGIA DE FONDO (Refetch Global)
    // Solo se usa si el trigger se activa
    // -----------------------------------------------------------------------
    useEffect(() => {
        // Solo usar todo si NO es una creación inmediata (para no descolocar el scroll)
        if (refreshTrigger > 0) {
            // console.log("Trigger de fondo recibido. Actualizando datos...");
            refetch();
        }
    }, [refreshTrigger, refetch]);

       // -----------------------------------------------------------------------
    // GESTOR DE EVENTOS
    // Confirma los datos actuales desde el evento en blockchain
    // -----------------------------------------------------------------------
    const handleBlockchainEvent = (data: Partial<Event> & { txHash: string }) => {
        setProductListDB((prevList) => {
            return prevList.map(product => {
                // Coincidencia por HASH (Crucial para productos recién creados con ID temporal)
                const isMatchHash = product.pendingTxHash &&
                    data.txHash &&
                    product.pendingTxHash.toLowerCase() === data.txHash.toLowerCase();

                // Coincidencia por ID (Para productos ya existentes: Transferir/Borrar)
                const isMatchId = String(product.blockchainId) === String(data.productBlockchainId);

                if (!isMatchHash && !isMatchId) {
                    return product;
                }

                // SEGURIDAD EXTRA (De tu código antiguo):
                // Si el producto está esperando un Hash concreto (pendingTxHash)
                // pero el evento trae OTRO hash diferente (y coincidió solo por ID),
                // significa que es un evento viejo o una colisión. Se ignora.
                if (product.pendingTxHash && !isMatchHash && isMatchId) {
                    return product;
                }

                if (isMatchHash || isMatchId) {
                    return {
                        ...product,
                        isVerified: true,
                        active: data.type === 'DELETED' ? false : true,
                        currentOwner: data.toAddress || product.currentOwner,
                        pendingTxHash: undefined,
                        // Si el evento trae ID y había uno temp, actualiza (seguridad extra)
                        blockchainId: data.productBlockchainId ? Number(data.productBlockchainId) : product.blockchainId
                    };
                }
                return product;
            });
        });
    };

    // ---------------------------------------------------------
    // ESCUCHADOR DE EVENTOS (FRONTEND)
    // ---------------------------------------------------------
    // NOTA: Este hook utiliza internamente 'wagmi' (useWatchContractEvent).
    // Wagmi implementa su propio 'useEffect' que se monta automáticamente
    // al invocar la función. Mantiene una suscripción WebSocket/RPC activa
    // mientras este componente permanezca montado en el árbol de React.
    // No requiere useEffect adicional ni botón de arranque.
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
        setProductListDB((prev) => prev.map(p => {
            if (String(p.blockchainId) === String(id)) {
                return { ...p, pendingTxHash: txHash }
            }
            return p
        }))
        // Opcional: Avisa al store para quitar de la cola global
        removePendingVerification(id);
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
        refetch();
    }

    const replaceTempId = (tempId: string, realId: number) => {
        setProductListDB((prev) => prev.map(p => {
            if (String(p.blockchainId) === String(tempId)) {
                return { ...p, blockchainId: realId }
            }
            return p
        }))
    }

    return {
        productListDB,
        refetch,
        isLoading,
        error,
        optimisticActions: {
            create: optimisticCreate,
            transfer: optimisticTransfer,
            delete: optimisticDelete,
            rollback: optimisticRollback,
            attachHash: attachPendingHash,
            replaceId: replaceTempId
        }
    }
}