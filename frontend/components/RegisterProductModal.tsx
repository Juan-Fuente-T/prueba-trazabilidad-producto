'use client'

import { useEffect, useState } from 'react'
import { useRegisterProduct } from '@/hooks/useRegisterProduct'
import { keccak256,  toHex } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'
import { SUPPLY_CHAIN_ADDRESSES } from '@/config/supplyChainRoles'
import { getRoleName } from '@/utils/roleUtils'
import Modal from './Modal'

interface RegisterProductModalProps {
  isOpen: boolean
  onClose: () => void
}
interface Product {
  product: {
    blockchainId: number;
    quantity: number;
    characterizationHash: string;
    currentOwner: string;
    timestamp: number;
    active: boolean;
    name: string;
    description: string;
    imageUrl: string;
  },
  creationTxHash: string;
}

export default function RegisterProductModal({ isOpen, onClose }: RegisterProductModalProps) {
  const [quantity, setQuantity] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Estados de control
  const [isBackendSaving, setIsBackendSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { address: connectedAddress } = useAccount();
  const { registerProduct, isPending, isConfirming, isSuccess, error: blockchainError, hash: txHash } = useRegisterProduct()

  // Genera un hash a partir de contenido único
  const calculateHash = () => {
    const uniqueString = `${name}-${description}-${Date.now()}`
    return keccak256(toHex(uniqueString))
  }

  const { refetch: updateId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'productId',
  })

  useEffect(() => {
    if (blockchainError) setErrorMessage(blockchainError)
      if (isSuccess && txHash && !isBackendSaving) {
        const guardarEnBackend = async () => {
          setIsBackendSaving(true)
          try {
          const result = await updateId();
          const realIdFromContract = Number(result.data); // Convierte BigInt a Number

          console.log("💎 ID leido del contrato:", realIdFromContract);

          if (!realIdFromContract) {
            throw new Error("❌ Error crítico: No se pudo leer el ID del producto de la Blockchain. Abortando guardado.");
          }

          const productData: Product = {
            product: {
              blockchainId: realIdFromContract,
              quantity: parseInt(quantity),
              characterizationHash: calculateHash(),
              currentOwner: connectedAddress as `0x${string}`,
              timestamp: Date.now(),
              active: true,
              name,
              description,
              imageUrl: imageFile ? URL.createObjectURL(imageFile) : ""
            },
            creationTxHash: txHash
          }

          const txProduct = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
          });
          const productResponse = await txProduct.json();

          if (!txProduct.ok || (productResponse.success === false)) {
            throw new Error(productResponse.message || "Error al guardar el producto en BD");
          }
          // Espera 3 segundos para que el usuario vea el mensaje de éxito
          const timer = setTimeout(() => {
            onClose()
            resetForm()
          }, 3000)

          return () => clearTimeout(timer) // Limpia el timer si el componente se desmonta

        } catch (e) {
          console.error("Error guardando en backend", e)
          setErrorMessage((e as Error).message || "Error desconocido al guardar");
        } finally {
          setIsBackendSaving(false)
        }
      }
      guardarEnBackend()
    }
  }, [isSuccess, blockchainError, txHash, onClose])

  const resetForm = () => {
    setQuantity('')
    setName('')
    setDescription('')
    setImageFile(null)
    setIsBackendSaving(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productHash = calculateHash()

    // console.log('Enviando a Blockchain:', { quantity, productHash })
    registerProduct(BigInt(quantity), productHash)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Product">
      <form onSubmit={handleSubmit} className="space-y-4 z-[999]">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder='Nombre del producto...'
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            required>
          </textarea>
        </div>
        {/* DRAG AND DROP ZONE */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Imagen del Producto</label>

          <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="text-center">
              {imageFile ? (
                // Si hay archivo, muestra el nombre
                <div className="text-emerald-600 font-semibold flex flex-col items-center">
                  <span className="text-2xl">📎</span>
                  <span>{imageFile.name}</span>
                  <span className="text-xs text-gray-400 mt-1">(Haz clic para cambiar)</span>
                </div>
              ) : (
                // Si no hay archivo, muestra las instrucciones
                <div className="flex flex-col items-center text-gray-500">
                  <span className="text-3xl mb-2">☁️</span>
                  <p className="font-medium">Arrastra tu imagen aquí</p>
                  <p className="text-xs mt-1">o haz clic para buscar en tus carpetas</p>
                </div>
              )}
            </div>

          </div>
        </div>
        {isSuccess && errorMessage != '' && !blockchainError? (
          <p className="text-green-500 mt-2 text-4xl font-bold">Producto registrado exitosamente.</p>
        ) : (
             <p className="text-red-500 mt-2 text-center text-sm bg-red-50 p-2 rounded">
                Error: {errorMessage || blockchainError}
             </p>
            )}
        {isPending || isConfirming ? (
          <p className="text-blue-500 mt-2">Transacción en proceso...</p>
        ) : (
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!quantity || !name || isPending || isConfirming || isSuccess || isBackendSaving}
          >
            Crear
          </button>
        )}
      </form>
    </Modal>
  )
}