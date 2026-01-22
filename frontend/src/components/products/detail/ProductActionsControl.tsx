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
        {/*}<div className="flex w-full gap-3 w-full md:w-auto md:flex-col shrink-0">*/}
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
                onSuccess={(data) => {
                    const deleteData = data as DeleteSuccessData;
                    if (deleteData?.txHash) {
                        handleSuccess(deleteData.txHash, 'DELETED', product.currentOwner);
                    }
                }}
            />
        </div>
    // return (
    //     <>
    //         <div className="flex w-full gap-3 w-full md:w-auto md:flex-col shrink-0">
    //             <button
    //                 onClick={() => setIsTransferOpen(true)}
    //                 className="flex-1 md:max-w-[120px] bg-industrial hover:bg-industrial-dark text-white py-2 px-3 rounded text-xs font-bold shadow-sm transition-all"
    //             >
    //                 🔄 Asignar
    //             </button>
    //             <button
    //                 onClick={() => setIsDeleteOpen(true)}
    //                 className="flex-none bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 px-3 rounded text-xs font-bold transition-all"
    //             >
    //                 🗑️ Baja
    //             </button>
    //         </div>

    //         {/* MODALES encapsulados aquí */}
    //         <TransferProductModal
    //             isOpen={isTransferOpen}
    //             onClose={() => setIsTransferOpen(false)}
    //             preFilledId={product.blockchainId.toString()}
    //             onSuccess={(data) => handleSuccess(data, 'TRANSFERRED', data.newOwner)}
    //         />
    //         <DeleteProductModal
    //             isOpen={isDeleteOpen}
    //             onClose={() => setIsDeleteOpen(false)}
    //             preFilledId={product.blockchainId.toString()}
    //             onSuccess={(data) => handleSuccess(data, 'DELETED', product.currentOwner)}
    //         />
    //     </>
    );
};