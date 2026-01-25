import { ProductDB, ProductUI } from './product'
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

/**
 * ActionModalProps
 * ----------------
 * Interfaz compartida para los modales de acción.
 *
 * NOTA SOBRE 'onRollback':
 * Se define recibiendo (id, type) porque el Dashboard necesita esos datos
 * para localizar y revertir el cambio en la fila exacta de la lista.
 *
 * Sin embargo, en la Ficha de Producto (donde no hay lista), es válido pasar
 * una función que ignore esos parámetros y simplemente recargue: () => refetch().
 *
 * TypeScript permite esta flexibilidad (ignorar argumentos no usados) sin dar error.
 */
export interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    preFilledId?: string;
    onSuccess: (data?: OperationResult) => void;
    onOptimisticCreate?: (newProduct: ProductDB) => void;
    onOptimisticUpdate?: (updatedProduct: Partial<ProductUI>) => void;
    onOptimisticDelete?: (productId: string | number) => void;
    onRollback?: (productId: string | number, type: 'create' | 'transfer' | 'delete') => void;
}