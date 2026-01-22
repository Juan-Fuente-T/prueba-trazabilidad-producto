import { useEffect, useRef } from 'react'
import { getEventListFromDB } from '@/services/productApi'
import { Event, PendingItem } from '@/types/events'

interface usePendingHashVerifierProps {
    pendingItems: PendingItem[],
    onItemVerified: (verifiedId: string | number) => void
}
export function usePendingHashVerifier({pendingItems, onItemVerified} : usePendingHashVerifierProps) {
// Usa useRef para guardar la función y evitar re-renderizados inutiles del useEffect
    const callbackRef = useRef(onItemVerified);
    callbackRef.current = onItemVerified;

// Contador de intentos
    const attemptsRef = useRef(0);
    const MAX_ATTEMPTS = 12; // 12 intentos = 60 segundos máximo

    useEffect(() => {
        if (pendingItems.length === 0) {
            attemptsRef.current = 0; // Resetea si no hay nada
            return;
        }

        const checkAllItems = async () => {
            // SEGURIDAD: Si llevamucho tiempo se detiene
            if (attemptsRef.current >= MAX_ATTEMPTS) {
                console.warn("⚠️ Tiempo de espera agotado. Deteniendo búsqueda.");
                return;
            }
            attemptsRef.current += 1; // Suma 1 intento

            // Recorre todos los items pendientes en paralelo
            await Promise.all(pendingItems.map(async (item) => {
                try {
                    const events = await getEventListFromDB(String(item.id));

                    if (!events) return;
                    // Busca coincidencia: Hash igual + isVerified true
                    const match = events.find((e: Event) => {
                        return (
                            e.transactionHash?.toLowerCase() === item.hash.toLowerCase() &&
                            e.isVerified === true
                        );
                    });

                    if (match) {
                        console.log(`✅ VERIFICADO: Producto ${item.id}`);
                        callbackRef.current(item.id);
                    }
                } catch (error) {
                    console.error(`Error verificando item ${item.id}`, error);
                }
            }));
        };

        checkAllItems();

        // Cada 5 segundos (Polling inteligente)
        const intervalId = setInterval(() => {
            // Chequeo de intentos dentro del intervalo para frenarlo
            if (attemptsRef.current >= MAX_ATTEMPTS) {
                clearInterval(intervalId);
            } else {
                checkAllItems();
            }
        }, 5000);

        return () => clearInterval(intervalId);

    }, [pendingItems]);
}