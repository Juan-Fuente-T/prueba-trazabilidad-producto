'use client'

import { useEffect } from 'react'
import Modal from '../../ui/Modal'
import ImageUpload from '@/components/ui/ImageUpload'
import { useProductCreationLogic } from '@/hooks/orchestration/useProductCreationLogic'
import { ActionModalProps } from '@/types/operations';

export default function RegisterProductModal({ isOpen, onClose }: ActionModalProps) {
const {
    formData,
    imageFile,
    setImageFile,
    handleChange,
    handleSubmit,
    resetForm,
    status,
    errors
  // } = useProductCreationLogic(onClose)
  } = useProductCreationLogic()

  // Limpieza al cerrar
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Product">
      <form onSubmit={handleSubmit} className="space-y-4 z-[999]">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            id='name'
            name='name'
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
            id='quantity'
            name='quantity'
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
            name='description'
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
        {errors.blockchainError && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded text-center border border-red-200">
            ❌ Error Blockchain: {errors.blockchainError.message}
          </p>
        )}

        {/* B. Error Base de Datos (Caso Limbo) */}
        {status.isSuccess && errors.errorDB && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded text-center">
            <p className="text-orange-700 font-bold text-sm">⚠️ Guardado en Blockchain, pero falló BD</p>
            <p className="text-orange-600 text-xs mt-1">{errors.errorDB}</p>
          </div>
        )}

        {/* C. Éxito Total */}
        {status.isSuccess && !errors.errorDB && !status.isSavingDB && (
          <p className="text-green-600 font-bold text-center text-lg animate-pulse">
            ✅ ¡Producto Creado Exitosamente!
          </p>
        )}

        {/* BOTÓN DE REGISTER */}
        {status.isPending || status.isConfirming ? (
          <p className="text-blue-500 mt-2">Transacción en proceso...</p>
        ) : (
          !status.isSuccess && ( // Opcional: Ocultar botón si ya hubo éxito para que no le den dos veces
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.quantity || !formData.name || status.isGlobalLoading}
            >
              {status.isGlobalLoading ? 'Procesando...' : 'Crear Producto'}
            </button>
          )
        )}
      </form>
    </Modal>
  )
}