export default function InstructionsSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto mb-16 px-4">

            {/* PASO 1: CONECTAR */}
            <div className="relative bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 -left-3 bg-stone-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    PASO 1
                </div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {/* Icono Wallet */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-800">Conecta tu Wallet</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                    Usa el botón superior derecho para conevtarme con un email con tu cuenta usando una wallet (por ejemplo MetaMask). Asegúrate de estar en la red de prueba correcta (Sepolia) para firmar transacciones sin coste real.
                </p>
            </div>

            {/* PASO 2: REGISTRAR */}
            <div className="relative bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 -left-3 bg-stone-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    PASO 2
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    {/* Icono Crear/Plus */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-800">Crea un Activo</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                    Pulsa en <strong>Nuevo Producto</strong>. Sube una imagen y define sus datos. Esto generará un registro en base de datos y acuñará el segistro de trazabilidad en la Blockchain.
                </p>
            </div>

            {/* PASO 3: GESTIONAR */}
            <div className="relative bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -top-3 -left-3 bg-stone-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    PASO 3
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    {/* Icono Intercambio */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m0-2.25 2.25 2.25m-2.25-2.25-2.25 2.25m11.25-2.25h-9m-6 3h1.5m1.5 0h1.5m1.5 0h1.5m1.5 0h1.5m1.5 0H21m-13.5-9h9m-9 0-2.25-2.25m2.25 2.25 2.25-2.25" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-stone-800">Transfiere o Borra</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                    Entra en el detalle de un producto (o hazlo directamente usando unid). Si eres el dueño, podrás <strong>Transferirlo</strong> a otra dirección nueva o elegir una prefijada(ej. Transportista) o <strong>Eliminarlo</strong> para sacarlo de circulación.
                </p>
            </div>
        </div>
    )
}