import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useRegisterProduct } from '@/hooks/blockchain/useRegisterProduct'
import { calculateHash } from '@/utils/hashUtils'
import { fileToBase64 } from '@/utils/fileUtils'
import { useToast } from '@/context/ToastContext'
import { ProductUI, ProductFormData } from '@/types/product'
import { useProductCreationStore } from '@/store/useProductCreationStore'
import { createBaseProductObject } from '@/utils/optimisticFactory';

interface useProductCreationLogicProps {
    onOptimisticCreate?: (product: ProductUI) => void;
    onRollback?: (tempId: string) => void;
    onSuccess?: () => void;
}

export const useProductCreationLogic = ({ onOptimisticCreate, onRollback, onSuccess }: useProductCreationLogicProps) => {
    const [formData, setFormData] = useState<ProductFormData>({ name: '', description: '', quantity: 0 }) // Ojo: quantity numero
    const [imageFile, setImageFile] = useState<File | null>(null)
    const { address: connectedAddress } = useAccount();
    const { showToast } = useToast()
    const { registerProduct, isPending, isConfirming, isSuccess, error: blockchainError, hash: txHash } = useRegisterProduct()

    const queueAction = useProductCreationStore(s => s.queueAction);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const tempId = `temp-${Date.now()}`

        try {
            const generatedHash = calculateHash(formData.name, formData.description);

            let imageBase64 = "";
            if (imageFile) {
                imageBase64 = await fileToBase64(imageFile);
            }
            if (onOptimisticCreate) {
                const baseProduct = createBaseProductObject(
                    formData,
                    generatedHash,
                    connectedAddress as string,
                    tempId,
                    imageBase64
                );

                // Específico de la optimistic UI
                onOptimisticCreate({
                    ...baseProduct,
                    isVerified: false,
                    isOptimistic: true
                });
            }

            showToast("Firmando...", "info")
            const tx = await registerProduct(BigInt(formData.quantity), generatedHash)

            // GUARDA EN ZUSTAND (Para que sobreviva al cierre del modal)
            // Hay un GESTOR EN 2º PLANO que gestiona el guardado en BD aunque el usuario cierre el modal o cambie de página.
            queueAction('CREATED', {
                formData: formData,
                creationHash: generatedHash,
                txHash: tx,
                imageString: imageBase64,
                tempId: tempId
            });

            resetForm();//Limpia el formulario

            if (onSuccess) onSuccess();// CIERRA MODAL
            showToast("Creación en proceso. Verificando...", "info");

        } catch (error) {
            console.error("Error/Cancelado", error);
            if (onRollback) onRollback(tempId);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const resetForm = () => {
        setFormData({ name: '', description: '', quantity: 0 })
        setImageFile(null)
    }

    return {
        formData,
        imageFile,
        txHash,
        setImageFile,
        handleChange,
        handleSubmit,
        resetForm,
        status: {
            isPending,
            isConfirming,
            isSuccess
        },
        errors: {
            blockchainError,
        }
    }
}