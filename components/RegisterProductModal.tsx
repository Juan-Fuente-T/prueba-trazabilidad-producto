'use client'

import { useEffect, useState } from 'react'
import Modal from './Modal'
import { useRegisterProduct } from '@/hooks/useRegisterProduct'
import { parseEther, keccak256, toBytes } from 'viem'

export default function RegisterProductModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [hash, setHash] = useState('')
  const [showError, setShowError] = useState(false)

  const { register, isPending, isConfirming, isSuccess, error } = useRegisterProduct()

  useEffect(() => {
    if (error) {
      setShowError(true) // Muestra el error si existe
    }
    if (isSuccess) {
      // Espera 3 segundos para que el usuario vea el mensaje de éxito
      const timer = setTimeout(() => {
        setIsOpen(false)
        setQuantity('')
        setHash('')
      }, 3000)

      return () => clearTimeout(timer) // Limpia el timer si el componente se desmonta
    }
  }, [isSuccess, error])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const hashBytes = keccak256(toBytes(hash))
    register(BigInt(quantity), hashBytes)

    console.log(' Registrando producto:', { quantity, hash })
  }

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          setShowError(false) //Limpia el formulario si hay error
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Registrar producto
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Product">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              min={1}
            //Todo: añadir no permitir letras o decimales
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Caracterización</label>
            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {isSuccess ? (
            <p className="text-green-500 mt-2">Producto registrado exitosamente.</p>
          ) : (
            showError && error && <p className="text-red-500 mt-2">{`Error al registrar el producto: ${error}`}</p>
          )}
          {isPending || isConfirming ? (
            <p className="text-blue-500 mt-2">Transacción en proceso...</p>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!quantity || !hash || isPending || isConfirming}
            >
              Crear
            </button>
          )}
        </form>
      </Modal>
    </>
  )
}