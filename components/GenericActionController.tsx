'use client'
import { useState } from 'react'

// Define qué datos debe recibir el modal
interface CommonModalProps {
    isOpen: boolean;
    onClose: () => void;
}
interface Props {
    buttonText: string;      // Ej: "Crear Producto"
    buttonColor: string;     // Ej: "bg-emerald-500 hover:bg-emerald-600"
    ModalComponent: React.ComponentType<CommonModalProps>;   // El modal que debe abrir (Registro, Borrado, etc)
}

export default function GenericActionController({ buttonText, buttonColor, ModalComponent }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='flex justify-center items-center w-full'>

            {/* Botón dinámico. Usa la variable de color del parametro en el css */}
            <button
                onClick={() => setIsOpen(true)}
                className={`w-full text-white text-sm md:text-md px-6 py-4 rounded-lg font-semibold shadow-md transition-all ${buttonColor}`}
            >
                {buttonText}
            </button>

            {/* Renderiza el modal pasando isOpen y onClose automáticamente. */}
            <ModalComponent isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}