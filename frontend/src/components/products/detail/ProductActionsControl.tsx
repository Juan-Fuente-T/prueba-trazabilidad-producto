// components/products/detail/ProductActionsControl.tsx
import TransferProductModal from '@/components/products/modals/TransferProductModal';
import DeleteProductModal from '@/components/products/modals/DeleteProductModal';
import { createOptimisticEvent } from '@/utils/optimisticFactory';
import GenericActionController from '@/components/ui/GenericActionController';
import { ProductUI } from '@/types/product';
import { Event } from '@/types/events';
import { TransferSuccessData, DeleteSuccessData } from '@/types/operations';

interface Props {
    product: ProductUI;
    onDataUpdate: (newOwner?: string, newEvent?: Event) => void;
}
const BURN_ADDRESS = "0x0000000000000000000000000000000000000000";

export const ProductActionsControl = ({ product, onDataUpdate }: Props) => {

    // Lógica auxiliar para crear el evento y actualizar
    const handleSuccess = (txHash: string, type: 'TRANSFERRED' | 'DELETED', newOwner: string) => {
        const optimisticEvent = createOptimisticEvent(
            product.blockchainId,
            txHash,
            product?.characterizationHash || "0xHashNoDisponible",
            type,
            product.currentOwner,
            newOwner
        );
        onDataUpdate(newOwner, optimisticEvent);
    };
    return (
        <div className="flex w-full gap-3 w-full lg:w-auto flex-row shrink-0 justify-center">
            {/* ASIGNAR */}
            <GenericActionController
                buttonText="🔄 Asignar"
                buttonColor="bg-industrial hover:bg-industrial-dark"
                ModalComponent={TransferProductModal}
                preFilledId={product.blockchainId.toString()}
                onSuccess={(data) => {
                    const transferData = data as TransferSuccessData;
                    if (transferData?.txHash) {
                        handleSuccess(transferData.txHash, 'TRANSFERRED', transferData.newOwner);
                    }
                }}
            />

            {/* DAR DE BAJA */}
            <GenericActionController
                buttonText="🗑️ Baja"
                buttonColor="bg-rose-500 hover:bg-rose-600 border-none"
                ModalComponent={DeleteProductModal}
                preFilledId={product.blockchainId.toString()}
                modalProps={{
                    onOptimisticDelete: () => {
                        handleSuccess("0xTempHash", 'DELETED', BURN_ADDRESS);
                    }
                }}
                // Cuando el modal confirma que ha firmado (onSuccess),recibe el hash REAL
                // y lo sobreescribe al producto para después verificarlo.
                onSuccess={(data) => {
                    const deleteData = data as DeleteSuccessData;
                    if (deleteData?.txHash) {
                        handleSuccess(deleteData.txHash, 'DELETED', product.currentOwner);
                    }
                }}
            />
        </div>
    );
};