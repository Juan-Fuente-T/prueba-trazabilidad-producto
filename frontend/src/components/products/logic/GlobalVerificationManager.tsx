'use client';

import { useProductCreationStore } from '@/store/useProductCreationStore';
import { usePendingHashVerifier } from '@/hooks/orchestration/usePendingHashVerifier';
import { useToast } from '@/context/ToastContext';

/**
 * Este componente es el vigilante global de respaldo de la aplicación.
 * * Su función es vigilar si hay transacciones que todavía continúan pendientes (spinners de verificación)
 * si el usuario recarga la página, cambia de ruta o si los WebSockets fallan.
 * * 1. Lee la lista de verificaciones pendientes del Store Global.
 * 2. Usa polling inteligente para preguntar a la Base de Datos si ya existen.
 * 3. Cuando se confirman, avisa a la UI para apagar el spinner SIN recargar toda la tabla.
 */
export default function GlobalVerificationManager() {
    const pendingVerifications = useProductCreationStore(s => s.pendingVerifications);
    // const triggerRefresh = useProductCreationStore(s => s.triggerRefresh);
    const notifyLocalProductUpdate = useProductCreationStore(s => s.notifyLocalProductUpdate);
    const removePendingVerification = useProductCreationStore(s => s.removePendingVerification);
    const { showToast } = useToast();

    // Se le pasa la lista de eventos sin verificar que viene del store.
    // El hook se encarga de llamar a getEventListFromDB y comparar hashes.
    usePendingHashVerifier({
        pendingItems: pendingVerifications,
        onItemVerified: (verifiedId) => {
            // console.log(`LOTE ${verifiedId} VERIFICADO!`);
            removePendingVerification(verifiedId);// Quita de la lista de pendientes (ya está verificado)
            // Busca el producto con ese ID y le envía los datos de verificación
            notifyLocalProductUpdate(verifiedId, {
                isVerified: true,
                pendingTxHash: undefined
            });
            // triggerRefresh();// Avisa a la app para que quite el spinner (Refetch)
            showToast(`Lote #${verifiedId} verificado en Blockchain.`, "success");
        }
    });

    return null; // No renderiza nada
}