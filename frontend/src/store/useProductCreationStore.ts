import { create } from 'zustand';
import { ProductUI } from '@/types/product';
import { PendingItem, TypeEvent, ActionPayload, PendingAction, WorkerUpdate } from '@/types/events';

// Define datos a guardar mientras la confirmación deblockchain llega


interface ProductCreationState {
    pendingAction: PendingAction | null;
    isProcessing: boolean;
    // Estados auxiliares (Verificación y UI)
    pendingVerifications: { id: string | number; hash: string }[];// Cola de ventos sin verificar
    lastWorkerUpdate: WorkerUpdate | null;
    refreshTrigger: number;//Si el numero varía se dispara la llamada a datos
    // ACCIONES
    queueAction: (type: TypeEvent, data: ActionPayload) => void;
    clearQueue: () => void;
    setProcessing: (status: boolean) => void;

    addPendingVerification: (item: PendingItem) => void; // ACCIONES de VERIFICACIÓN de eventos
    removePendingVerification: (id: string | number) => void;
    triggerRefresh: () => void;    // Recarga lista de productos
    notifyWorkerUpdate: (lookupId: string | number, changes: Partial<ProductUI>) => void;
}

export const useProductCreationStore = create<ProductCreationState>((set) => ({
    pendingAction: null,
    isProcessing: false,

    pendingVerifications: [],
    refreshTrigger: 0,
    lastWorkerUpdate: null,

    queueAction: (type, data) => set({ pendingAction: { type, data } }),
    clearQueue: () => set({ pendingAction: null, isProcessing: false }),
    setProcessing: (status) => set({ isProcessing: status }),
    addPendingVerification: (item) => set((state) => {
        if (state.pendingVerifications.find(i => i.id === item.id)) return state;
        return { pendingVerifications: [...state.pendingVerifications, item] };
    }),
    removePendingVerification: (id) => set((state) => ({
        pendingVerifications: state.pendingVerifications.filter((i) => i.id !== id)
    })),
    // Al cambiar el valor sumando 1, todos los useEffects que dependan de esto se dispararán.
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
    notifyWorkerUpdate: (lookupId, changes) => set({ lastWorkerUpdate: { lookupId, changes } })
}));