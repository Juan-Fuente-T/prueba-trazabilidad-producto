
// Lo que devuelve el modal de Transferencia al tener éxito
export interface TransferSuccessData {
    newOwner: string;
    txHash: string;
}

// Lo que devuelve el modal de Borrado
export interface DeleteSuccessData {
    deleted: boolean;
    txHash: string;
}
export interface CreateSuccessData {
    txHash: string;
    newProductId?: string;
}

export type OperationResult = TransferSuccessData | DeleteSuccessData | CreateSuccessData;

export type OperationResultWithID = OperationResult & { id: string };

// Tipo general para los modales de transacciones
export interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    preFilledId?: string;
    onSuccess: (data?: OperationResult) => void;
}