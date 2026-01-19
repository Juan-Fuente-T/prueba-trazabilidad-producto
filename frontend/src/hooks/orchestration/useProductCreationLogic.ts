import { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'
import { useRegisterProduct } from '@/hooks/blockchain/useRegisterProduct'
import { useSaveProductToDB } from '@/hooks/api/useSaveProductToDB'
import { calculateHash } from '@/utils/hashUtils'
import { fileToBase64 } from '@/utils/fileUtils'
import { useProductMetrics } from '@/hooks/blockchain/useProductMetrics';


export const useProductCreationLogic = () => {
    const [formData, setFormData] = useState({ name: '', description: '', quantity: '' })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const { address: connectedAddress } = useAccount();
    const { registerProduct, isPending, isConfirming, isSuccess, error: blockchainError, hash: txHash } = useRegisterProduct()
    const { saveToDB, isSavingDB, errorDB, resetDBStatus } = useSaveProductToDB()
    const productHashRef = useRef<string | null>(null)

    const { updateProductId } = useProductMetrics()

    useEffect(() => {
        if (isSuccess && txHash && !isSavingDB) {
            const saveInBackend = async () => {
                try {
                    const result = await updateProductId();
                    const realIdFromContract = Number(result.data);

                    if (!realIdFromContract) {
                        throw new Error("❌ Error crítico: No se pudo leer el ID del producto de la Blockchain. Abortando guardado.");
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
                } catch (e) {
                    console.error("Error crítico orquestación:", e)
                    // Aquí se podría usar un toast
                }
            }
            saveInBackend()
        }
    }, [isSuccess, txHash])

    const resetForm = () => {
        setFormData({ name: '', description: '', quantity: '' })
        setImageFile(null)
        productHashRef.current = null;
        resetDBStatus()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const productHash = calculateHash(formData.name, formData.description)
        // Guarda el hash para evitar posibles duplicados
        productHashRef.current = productHash
        registerProduct(BigInt(formData.quantity), productHash)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        // Copia todo lo anterior y sobreescribe solo ese campo
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const isGlobalLoading = isPending || isConfirming || isSavingDB

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