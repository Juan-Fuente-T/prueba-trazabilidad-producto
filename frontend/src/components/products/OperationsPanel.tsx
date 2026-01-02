
import RegisterProductModal from "@/components/products/modals/RegisterProductModal";
import DeleteProductModal from "@/components/products/modals/DeleteProductModal";
import TransferProductModal from "@/components/products/modals/TransferProductModal";
import GenericActionController from "@/components/ui/GenericActionController"; import EventNotifications from "@/components/events/EventNotifications";

export default function OperationsPanel() {
    return (
        <section className="w-full mx-auto bg-white max-w-5xl border border-stone-400 shadow-inner py-12 px-4 rounded">
            <div className=" mx-auto">

                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-stone-300 flex-1"></div>
                    <h3 className="text-stone-400 font-bold uppercase text-xs tracking-widest">Panel de Operaciones</h3>
                    <div className="h-px bg-stone-300 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta 1: Registrar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                        <h2 className="text-lg font-bold mb-4 text-center text-stone-700">Nuevo Ingreso</h2>
                        <GenericActionController
                            buttonText="Registrar Producto"
                            buttonColor="bg-emerald-600 hover:bg-emerald-700"
                            ModalComponent={RegisterProductModal}
                        />
                    </div>

                    {/* Tarjeta 2: Transferir */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                        <h2 className="text-lg font-bold mb-4 text-center text-stone-700">Movimientos</h2>
                        <GenericActionController
                            buttonText="Transferir Producto"
                            buttonColor="bg-indigo-600 hover:bg-indigo-700"
                            ModalComponent={TransferProductModal}
                        />
                    </div>

                    {/* Tarjeta 3: Borrar */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                        <h2 className="text-lg font-bold mb-4 text-center text-stone-700">Zona de Peligro</h2>
                        <GenericActionController
                            buttonText="Eliminar Producto"
                            buttonColor="bg-rose-600 hover:bg-rose-700"
                            ModalComponent={DeleteProductModal}
                        />
                    </div>
                </div>

                <EventNotifications />
            </div>
        </section>
    )
}