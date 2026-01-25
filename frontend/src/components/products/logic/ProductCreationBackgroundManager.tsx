'use client';

import { useEffect } from 'react';
import { useProductCreationStore } from '@/store/useProductCreationStore';
import { useProductMetrics } from '@/hooks/blockchain/useProductMetrics';
import { useSaveProductToDB } from '@/hooks/api/useSaveProductToDB';
import { useDeleteProductToDB } from '@/hooks/api/useDeleteProductToDB';
import { useTransferProductToDB } from '@/hooks/api/useTransferProductToDB';
import { useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { useToast } from '@/context/ToastContext';
import { ProductPayload } from '@/types/product';
import { createBaseProductObject } from '@/utils/optimisticFactory';

export default function ProductCreationBackgroundManager() {
    const pendingAction = useProductCreationStore(s => s.pendingAction);
    const isProcessing = useProductCreationStore(s => s.isProcessing);
    const setProcessing = useProductCreationStore(s => s.setProcessing);
    const clearQueue = useProductCreationStore(s => s.clearQueue);

    const notifyLocalProductUpdate = useProductCreationStore(s => s.notifyLocalProductUpdate);
    const addPendingVerification = useProductCreationStore(s => s.addPendingVerification);
    const removePendingVerification = useProductCreationStore(s => s.removePendingVerification);
    const triggerRefresh = useProductCreationStore(s => s.triggerRefresh);

    const { address } = useAccount();
    const { showToast } = useToast();
    const { updateProductId } = useProductMetrics();
    const { saveToDB } = useSaveProductToDB();
    const { deleteToDB } = useDeleteProductToDB();
    const { transferToDB } = useTransferProductToDB();

    // -------------------------------------------------------------------------
    // LISTENER DE BLOCKCHAIN (WAGMI)
    // Vigila si hay transacciones pendientes
    // -------------------------------------------------------------------------

    const { isSuccess, isError, error: txError } = useWaitForTransactionReceipt({
        hash: pendingAction?.data.txHash as `0x${string}`,
        query: { enabled: !!pendingAction?.data.txHash }
    });

    // -------------------------------------------------------------------------
    // EFECTOS (EJECUCIÓN)
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (isSuccess && pendingAction && !isProcessing) {

            const executeAction = async () => {
                setProcessing(true); // Bloquea
                const { type, data } = pendingAction;

                try {
                    // =================== CASO 1: CREAR ===================
                    if (type === 'CREATED') {
                        const result = await updateProductId();
                        let realId = Number(result.data);
                        if (realId > 0) realId = realId - 1;

                        const baseProduct = createBaseProductObject(
                            data.formData!, data.creationHash!, address as string, realId, data.imageString!
                        );

                        await saveToDB({ product: baseProduct as ProductPayload['product'], creationTxHash: data.txHash });

                        notifyLocalProductUpdate(data.tempId!, { blockchainId: realId, isVerified: true, pendingTxHash: undefined });
                        addPendingVerification({ id: realId, hash: data.creationHash! });

                        showToast(`Lote #${realId} creado.`, "success");
                    }

                    // =================== CASO 2: BORRAR ===================
                    else if (type === 'DELETED') {
                        await deleteToDB({
                            blockchainId: data.id!,
                            txHash: data.txHash,
                            expectedProductHash: data.expectedHash!
                        });
                        notifyLocalProductUpdate(data.id!, { active: false, isVerified: true, pendingTxHash: undefined });
                        addPendingVerification({ id: data.id!, hash: data.txHash });

                        showToast("Baja confirmada.", "success");
                    }

                    // =================== CASO 3: TRANSFERIR ===================
                    else if (type === 'TRANSFERRED') {
                        await transferToDB({
                            blockchainId: data.id!,
                            txHash: data.txHash,
                            newOwnerAddress: data.newOwner!,
                            expectedProductHash: data.expectedHash!
                        });

                        notifyLocalProductUpdate(data.id!, { currentOwner: data.newOwner!, isVerified: true, pendingTxHash: undefined });
                        addPendingVerification({ id: data.id!, hash: data.txHash });

                        showToast("Asignación confirmada.", "success");
                    }

                    // COMÚN A TODOS
                    // triggerRefresh();

                } catch (error) {
                    console.error(`❌ Error procesando ${type}:`, error);
                    showToast(`Error al sincronizar ${type}`, "error");
                } finally {
                    setProcessing(false); // Desbloquea
                    clearQueue();         // y limpia
                }
            };

            executeAction();
        }
    }, [isSuccess, pendingAction, isProcessing, address, updateProductId, saveToDB, deleteToDB, transferToDB, notifyLocalProductUpdate, addPendingVerification, triggerRefresh, showToast, setProcessing, clearQueue]);

    // -------------------------------------------------------------------------
    // EFECTOS (ROLLBACK PARA ERRORES)
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (isError && pendingAction) {
            console.error("BACKGROUND MANAGER -La transacción falló en Blockchain:", txError);
            const { type, data } = pendingAction;
            showToast(`Error: La operación ${type} falló en la red. Deshaciendo cambios...`, "error");

            // Dispara refresco global para sobreescribir el dato optimista falso.
            triggerRefresh();

            // Limpieza de colas de verificación
            if (data.id) removePendingVerification(data.id);
            if (data.tempId) removePendingVerification(data.tempId);
            setProcessing(false);
            clearQueue();
        }
    }, [isError, pendingAction, txError, showToast, triggerRefresh, removePendingVerification, setProcessing, clearQueue]);
    return null; // Componente solo lógico, no pinta datos
}