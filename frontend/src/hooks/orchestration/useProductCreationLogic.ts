import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { useRegisterProduct } from '@/hooks/blockchain/useRegisterProduct'
import { useSaveProductToDB } from '@/hooks/api/useSaveProductToDB'
import { calculateHash } from '@/utils/hashUtils'
import { fileToBase64 } from '@/utils/fileUtils'
import { useProductMetrics } from '@/hooks/blockchain/useProductMetrics'
import { useToast } from '@/context/ToastContext'
import { ProductUI } from '@/types/product'

interface useProductCreationLogicProps {
    onOptimisticCreate?: (product: ProductUI) => void;
    onRollback?: (tempId: string) => void;
    onSuccess?: () => void;
}

export const useProductCreationLogic = ({ onOptimisticCreate, onRollback, onSuccess }: useProductCreationLogicProps) => {
    const [formData, setFormData] = useState({ name: '', description: '', quantity: '' })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const { address: connectedAddress } = useAccount();
    const { showToast } = useToast()

    const { registerProduct, isPending, isConfirming, isSuccess, error: blockchainError, hash: txHash } = useRegisterProduct()
    const { saveToDB, isSavingDB, errorDB, resetDBStatus } = useSaveProductToDB()
    const productHashRef = useRef<string | null>(null)
    const tempIdRef = useRef<string | null>(null)

    const { updateProductId } = useProductMetrics()

    useEffect(() => {
        if (isSuccess && txHash && !isSavingDB) {
            const saveInBackend = async () => {
                try {
                    const result = await updateProductId();
                    const realIdFromContract = Number(result.data);

                    if (!realIdFromContract) {
                        throw new Error("❌ Error crítico: No se pudo leer el ID del lote de la Blockchain. Abortando guardado.");
                    }

                    // TODO: OPTIMIZACIÓN DEL ALMACENAMIENTO
                    // Actualmente, las imágenes se almacenan como cadenas Base64 directamente en MongoDB para simplificar
                    // y mantener la autocontención del MVP, aunque aumenta significativamente el tamaño del documento.
                    // En PRODUCCIÓN se deben transferir las imágenes a un servicio de almacenamiento de dedicado
                    // (p. ej., AWS S3, Cloudinary) o a un almacenamiento descentralizado (IPFS) almacenando aquí solo la URL.
                    let finalImageString = ""
                    if (imageFile) {
                        try {
                            finalImageString = await fileToBase64(imageFile)
                        } catch (err) {
                            console.error("Error convirtiendo imagen", err)
                        }
                    }

                    const payload = {
                        product: {
                            ...formData,
                            quantity: Number(formData.quantity),
                            blockchainId: realIdFromContract,
                            characterizationHash: productHashRef.current as `0x${string}`,
                            currentOwner: connectedAddress as `0x${string}`,
                            timestamp: Date.now(),
                            active: true,
                            imageUrl: finalImageString
                        },
                        creationTxHash: txHash
                    }
                    await saveToDB(payload)
                    // No hace falta toast aquí si ya lo ve el usuario en la lista con el check verde
                    // showToast("Lote confirmado y guardado", "success")
                } catch (e) {
                    console.error("Error crítico orquestación:", e)
                    showToast("Error guardando en base de datos", "error")
                }
            }
            saveInBackend()
        }
    }, [isSuccess, txHash])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Genera un ID temporal único
        const tempId = `temp-${Date.now()}`
        tempIdRef.current = tempId

        const optimisticPayload: ProductUI = {
            blockchainId: tempId,
            name: formData.name,
            description: formData.description,
            quantity: Number(formData.quantity),
            currentOwner: connectedAddress || '',
            timestamp: Date.now(),
            active: true,
            // Para ver la imagen al instante sin esperar conversión Base64
            imageUrl: imageFile ? URL.createObjectURL(imageFile) : '',
            isVerified: false,
            isOptimistic: true
        }

        try {
            // UI Optimista
            if (onOptimisticCreate) {
                onOptimisticCreate(optimisticPayload)
            }

            // Cierra modal o avisa al usuario (Depende de decisión de UX)
            if (onSuccess) onSuccess();
            showToast("Creando lote...", "info")

            const productHash = calculateHash(formData.name, formData.description)
            // Guarda el hash para evitar posibles duplicados
            productHashRef.current = productHash
            // LLama al guardado en Blockchain
            const tx = await registerProduct(BigInt(formData.quantity), productHash)
            console.log("TX hash de CREACION", tx)

            showToast("Transacción enviada. Esperando confirmación...", "info");
        } catch (error) {
            console.log("Cancelado/Error");
            // Esto borra el cambio optimista falso si la creación falla
            if (onRollback) {
                onRollback(tempId)
            } showToast("Operación cancelada", "error");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        // Copia todo lo anterior y sobreescribe solo ese campo
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const isGlobalLoading = isPending || isConfirming || isSavingDB

    const resetForm = () => {
        setFormData({ name: '', description: '', quantity: '' })
        setImageFile(null)
        productHashRef.current = null;
        resetDBStatus()
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
            isSuccess,
            isSavingDB,
            isGlobalLoading
        },
        errors: {
            blockchainError,
            errorDB
        }
    }
}