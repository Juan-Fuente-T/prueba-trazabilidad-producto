import React from "react"

interface ConfirmDeleteModalProps {
    isOpen: boolean
    onCancel: () => void
    onConfirm: () => void
}

export default function ConfirmDeleteModal({
    isOpen,
    onCancel,
    onConfirm,
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
                <p className="mb-4 text-gray-800">
                    ¿Seguro que quieres borrar este producto?
                </p>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Sí, borrar
                    </button>
                </div>
            </div>
        </div>
    )
}