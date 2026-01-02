'use client'

import { useEffect, useState } from 'react'
import Modal from '../../ui/Modal'
import { useRegisterProduct } from '@/hooks/useRegisterProduct'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'
import ImageUpload from '@/components/ui/ImageUpload'
import { useSaveProductToDB } from '@/hooks/useSaveProductToDB'
import { calculateHash } from '@/utils/hashUtils'

interface RegisterProductModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegisterProductModal({ isOpen, onClose }: RegisterProductModalProps) {
  const [formData, setFormData] = useState({ name: '', description: '', quantity: '' })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { address: connectedAddress } = useAccount();
  const { registerProduct, isPending, isConfirming, isSuccess, error: blockchainError, hash: txHash } = useRegisterProduct()
  const { saveToDB, isSavingDB, errorDB, resetDBStatus } = useSaveProductToDB()

  const { refetch: updateId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'productId',
  })

  // Limpieza al cerrar
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen])

  useEffect(() => {
    if (isSuccess && txHash && !isSavingDB) {
      const saveInBackend = async () => {
        try {
          const result = await updateId();
          const realIdFromContract = Number(result.data);

          console.log("💎 ID leido del contrato:", realIdFromContract);

          if (!realIdFromContract) {
            throw new Error("❌ Error crítico: No se pudo leer el ID del producto de la Blockchain. Abortando guardado.");
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
              imageUrl: imageFile ? URL.createObjectURL(imageFile) : ""
            },
            creationTxHash: txHash
          }
          await saveToDB(payload)

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Product">
      <form onSubmit={handleSubmit} className="space-y-4 z-[999]">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder='Nombre del producto...'
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            required
            min={1}
          //Todo: añadir no permitir decimales
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            id='description'
            name="textarea"
            rows={4}
            cols={12}
            value={formData.description}
            onChange={handleChange}
            placeholder="Escribe tu mensaje..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            required>
          </textarea>
        </div>
        {/* DRAG AND DROP ZONE */}
        <ImageUpload file={imageFile} onFileChange={setImageFile} />

        {/* --- GESTIÓN DE ERRORES VISUAL --- */}
        {/* A. Error Blockchain */}
        {blockchainError && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center border border-red-200">
            ❌ Error Blockchain: {blockchainError}
          </p>
        )}

        {/* B. Error Base de Datos (Caso Limbo) */}
        {isSuccess && errorDB && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded text-center">
            <p className="text-orange-700 font-bold text-sm">⚠️ Guardado en Blockchain, pero falló BD</p>
            <p className="text-orange-600 text-xs mt-1">{errorDB}</p>
          </div>
        )}

        {/* C. Éxito Total */}
        {isSuccess && !errorDB && !isSavingDB && (
          <p className="text-green-600 font-bold text-center text-lg animate-pulse">
            ✅ ¡Producto Creado Exitosamente!
          </p>
        )}

        {/* BOTÓN DE REGISTER */}
        {isPending || isConfirming ? (
          <p className="text-blue-500 mt-2">Transacción en proceso...</p>
        ) : (
          !isSuccess && ( // Opcional: Ocultar botón si ya hubo éxito para que no le den dos veces
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.quantity || !formData.name || isGlobalLoading}
            >
              {isGlobalLoading ? 'Procesando...' : 'Crear Producto'}
            </button>
          )
        )}
      </form>
    </Modal>
  )
}