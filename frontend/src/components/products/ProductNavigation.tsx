import Link from 'next/link'

interface ProductNavigationProps {
    currentId: number;
}

export default function ProductNavigation({ currentId }: ProductNavigationProps) {
    //Calcula aquí los IDs para no ensuciar la página
    const prevId = currentId > 1 ? currentId - 1 : null
    const nextId = currentId + 1

    return (
        <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">

            {/* Botón Volver */}
            <Link href="/" className="text-stone-500 hover:text-emerald-600 flex items-center gap-2 transition-colors font-medium">
                ← Volver al listado
            </Link>

            {/* Botones Anterior / Siguiente */}
            <div className="flex items-center gap-3">
                {prevId ? (
                    <Link
                        href={`/products/${prevId}`}
                        className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-indigo-600 transition-colors shadow-sm text-sm font-medium"
                    >
                        ← Anterior
                    </Link>
                ) : (
                    <span className="px-4 py-2 border border-stone-100 rounded-lg text-stone-300 cursor-not-allowed text-sm">
                        ← Anterior
                    </span>
                )}

                <Link
                    href={`/products/${nextId}`}
                    className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 hover:text-indigo-600 transition-colors shadow-sm text-sm font-medium"
                >
                    Siguiente →
                </Link>
            </div>
        </div>
    )
}