// components/products/detail/ProductDetailHeader.tsx
import { ProductUI } from '@/types/product';
import { formatDate } from '@/utils/formatters';
import { getSyncBadgeStyles } from '@/utils/eventUiUtils';

interface Props {
    product: ProductUI;
    isOwner: boolean;
    actorRole: string;
    isPending: boolean;
}

export const ProductDetailHeader = ({ product, isOwner, actorRole, isPending }: Props) => {
    const badgeStyles = getSyncBadgeStyles(isPending);

    return (
        <div className={`p-4 border-b border-acero-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isOwner ? 'bg-acero-900 text-white' : 'bg-acero-50 text-acero-900'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1">
                <h1 className="text-xl font-bold font-mono tracking-tight">
                    Lote #{product?.blockchainId}
                </h1>
                <div className="flex gap-2 items-center">
                    {/* Badges de Estado y Rol */}
                        <div className="flex gap-2 items-center">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${product?.active ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                                } ${isOwner ? 'bg-white/10 text-emerald-300 border-white/20' : ''}`}>
                                {product?.active ? 'Activo' : 'Inactivo'}
                            </span>
                            {/* Badge de Pendiente en la ficha técnica */}
                            {isPending && (
                                <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide animate-pulse ${badgeStyles}`}>
                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Verificando...
                                </span>
                            )}
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${isOwner ? 'bg-white/10 text-acero-300 border-white/20' : 'bg-acero-200/50 text-acero-600 border-acero-200'
                                }`}>
                                {actorRole}
                            </span>
                        </div>
                </div>
            </div>
            <div className={`text-left md:text-right text-[10px] font-mono whitespace-nowrap ${isOwner ? 'text-acero-400' : 'text-acero-500'}`}>
                <span className="opacity-70 mr-2">REGISTRO:</span>
                {product?.timestamp ? formatDate(BigInt(product.timestamp)) : '-'}
            </div>
        </div>
    );
};