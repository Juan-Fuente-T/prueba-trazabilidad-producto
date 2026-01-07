'use client'
import { useState } from 'react'
import { ActionModalProps, OperationResult } from '@/types/operations'; // <--- IMPORTANTE

interface GenericActionControllerProps{
    buttonText: string      // Ej: "Crear Producto"
    buttonColor: string     // Ej: "bg-emerald-500 hover:bg-emerald-600"
    disabled?: boolean
    preFilledId?: string // Un id prefijado para transferir o borrar
    ModalComponent: React.ComponentType<ActionModalProps>   // El modal que debe abrir (Registro, Borrado, etc)
    onSuccess?: (data?: OperationResult) => void;
}

export default function GenericActionController({ buttonText, buttonColor, disabled, preFilledId, ModalComponent, onSuccess }: GenericActionControllerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='w-fit'>

            {/* Botón dinámico. Usa la variable de color del parametro en el css */}
            <button
                onClick={() => setIsOpen(true)}
                disabled={disabled}
                className={`w-full sm:w-auto text-white text-sm md:text-md text-nowrap px-6 py-2.5 rounded-lg font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${buttonColor}`}
            >
                {buttonText}
            </button>

            {/* Renderiza el modal pasando isOpen y onClose automáticamente. */}
            <ModalComponent
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            preFilledId={preFilledId || ''}
            onSuccess={(data) => {
                    if (onSuccess) onSuccess(data);
                    setIsOpen(false);
                }}/>
        </div>
    )
}