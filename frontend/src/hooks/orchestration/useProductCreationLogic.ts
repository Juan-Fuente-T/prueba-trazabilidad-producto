import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useReadContract } from 'wagmi'
import { useRegisterProduct } from '@/hooks/blockchain/useRegisterProduct'
import { useSaveProductToDB } from '@/hooks/api/useSaveProductToDB'
import { calculateHash } from '@/utils/hashUtils'
import { fileToBase64 } from '@/utils/fileUtils'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

// export const useProductCreationLogic = (onClose: () => void) => {
export const useProductCreationLogic = () => {
    const [formData, setFormData] = useState({ name: '', description: '', quantity: '' })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const router = useRouter()
    const { address: connectedAddress } = useAccount();
    const { registerProduct, isPending, isConfirming, isSuccess, error: blockchainError, hash: txHash } = useRegisterProduct()
    const { saveToDB, isSavingDB, errorDB, resetDBStatus } = useSaveProductToDB()

    const { refetch: updateId } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'productId',
        query: {
        enabled: false, // APAGADO POR DEFECTO para evitar llamadas continuas
    }
    })

    useEffect(() => {
        if (isSuccess && txHash && !isSavingDB) {
            const saveInBackend = async () => {
                try {
                    const result = await updateId();
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
                            characterizationHash: calculateHash(formData.name, formData.description),
                            currentOwner: connectedAddress as `0x${string}`,
                            timestamp: Date.now(),
                            active: true,
                            imageUrl: finalImageString
                        },
                        creationTxHash: txHash
                    }
                    await saveToDB(payload)

                    // Refresca la lista de productos
                    router.refresh()

                    // Espera 3 segundos para que el usuario vea el mensaje de éxito
                    // const timer = setTimeout(() => {
                    //   onClose()
                    //   resetForm()
                    // }, 3000)

                    // return () => clearTimeout(timer) // Limpia el timer si el componente se desmonta
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
        resetDBStatus()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const productHash = calculateHash(formData.name, formData.description)
        // console.log('Enviando a Blockchain:', { quantity, productHash })
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