export default function InformationSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl mx-auto mb-12">

            {/* 1. CREACIÓN */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-3 hover:border-emerald-200 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-stone-800">Registro Inmutable</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                    Cada producto creado genera un gemelo digital. Sus datos viven en base de datos, pero su existencia se sella eternamente en la Blockchain mediante un Hash único.
                </p>
            </div>

            {/* 2. TRANSFERENCIA */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-3 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-stone-800">Trazabilidad Total</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                    El activo cambia de manos (Fabricante ➝ Transportista ➝ Venta) de forma transparente. El historial de propietarios es público, verificable e imposible de falsificar.
                </p>
            </div>

            {/* 3. BORRADO */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-3 hover:border-rose-200 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-stone-800">Fin de Ciclo</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                    Cuando el producto sale del mercado, se quema digitalmente. Esto evita dobles ventas y certifica oficialmente que el activo ha dejado de estar en circulación.
                </p>
            </div>
        </div>
    )
}