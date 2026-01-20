// src/components/products/ProductSearchBar.tsx
interface ProductSearchBarProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    totalProducts: number;
}

export default function ProductSearchBar({ searchTerm, onSearchChange, totalProducts }: ProductSearchBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-stone-200 shadow-sm mb-6">
            <div className="relative w-full sm:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-acero-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Filtrar por Nombre o ID..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    min={1}
                />
            </div>

            <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
                {totalProducts} productos listados
            </div>
        </div>
    )
}