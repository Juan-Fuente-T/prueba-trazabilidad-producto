'use client'

import { useEffect, useRef } from 'react'
import Modal from '../../ui/Modal'
import ImageUpload from '@/components/ui/ImageUpload'
import { useProductCreationLogic } from '@/hooks/orchestration/useProductCreationLogic'
import { ActionModalProps } from '@/types/operations';

{/* 1. Diccionario Industrial (Naming)
      Dueño => Custodio Actual o Operador Responsable.
      Producto => Lote de Producción o Referencia.
      Cantidad => Unidades / Volumen.
      Crear => Registrar Lote. */}

export default function RegisterProductModal({ isOpen, onClose, onSuccess, onOptimisticCreate, onRollback }: ActionModalProps) {
const {
    formData,
    imageFile,
    txHash,
    setImageFile,
    handleChange,
    handleSubmit,
    resetForm,
    status,
    errors
  } = useProductCreationLogic({
      onOptimisticCreate: onOptimisticCreate,
      onRollback: (tempId) => {
          if (onRollback) onRollback(tempId, 'create')
      },
    onSuccess: onSuccess
  })
  //Util para evitar notificaciones duplicadas y re-renderizados de estas
  const hasNotifiedRef = useRef(false)
  // Limpieza al cerrar
  useEffect(() => {
    if (!isOpen) {
      hasNotifiedRef.current = false;
      resetForm();
    }
  }, [isOpen])

  useEffect(() => {
    if (status.isSuccess && !hasNotifiedRef.current) {
      //  BLOQUEA la noticacion más allá de una sola vez
      hasNotifiedRef.current = true
      onSuccess({
        txHash: txHash || "0xHashNoDisponible"
      })
    }
  }, [status.isSuccess, txHash, onSuccess])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register Product">
      <form onSubmit={handleSubmit} className="space-y-4 z-[999]">
        <div>
          <label className="block text-sm font-medium mb-1">Referencia</label>
          <input
            id='name'
            name='name'
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-acero-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder='Nombre del lote...'
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Volumen</label>
          <input
            id='quantity'
            name='quantity'
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border border-acero-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
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
            placeholder="Escribe la descripción..."
            className="w-full border border-acero-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            required>
          </textarea>
        </div>
        {/* DRAG AND DROP ZONE */}
        <ImageUpload file={imageFile} onFileChange={setImageFile} />

        {/* --- GESTIÓN DE ERRORES VISUAL --- */}
        {/* A. Error Blockchain */}
        {errors.blockchainError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
            {errors.blockchainError.message.includes("User denied") || errors.blockchainError.message.includes("rejected")
              ? "Operación cancelada por el usuario."
              : "Error al firmar la transacción."
              // : errors.blockchainError.message // Si es otro error, se muestra
            }
          </div>
        )}
        {/* BOTÓN DE REGISTER */}
        {status.isPending || status.isConfirming ? (
          <p className="text-blue-500 mt-2">Transacción en proceso...</p>
        ) : (
          !status.isSuccess && ( // Opcional: Ocultar botón si ya hubo éxito para que no le den dos veces
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!formData.quantity || !formData.name || status.isPending || status.isConfirming}
            >
              {status.isPending ? 'Procesando...' : 'Registrar Lote'}
            </button>
          )
        )}
      </form>
    </Modal>
  )
}