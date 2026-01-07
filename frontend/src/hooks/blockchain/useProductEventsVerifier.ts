'use client'

import { useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'
import { Event, TypeEvent } from '@/types/events'

type EventCallback = (message: string, type: TypeEvent) => void
// Callback para pasar los datos crudos y actualizar listas
type DataCallback = (eventData: Partial<Event>) => void

export function useProductEventsVerifier(onEvent: EventCallback, onNewData?: DataCallback) {
  console.log("RENDERIZANDO...useProductEventsverifier")
  // Escucha ProductRegistered
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'ProductRegistered',
    onLogs(logs) {
      logs.forEach((log) => {
        const { productId, owner } = log.args
        onEvent(`Producto #${productId} registrado por ${owner?.slice(0, 6)}...`, 'CREATED')
        // Pasa datos estructurados por si el padre quiere actualizar listas
        if (onNewData && productId !== undefined && owner) {
          onNewData({
            type: 'CREATED',
            blockchainId: Number(productId),
            to: owner,
            timestamp: Date.now(),
            isVerified: true
          })
        }
      })
    }
  })

  // Escucha ProductTransferred
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'ProductTransferred',
    onLogs(logs) {
      logs.forEach((log) => {
        const { productId, from, to } = log.args
        onEvent(`Producto #${productId} transferido de ${from?.slice(0, 6)}... a ${to?.slice(0, 6)}...`, 'TRANSFERRED')
        // Pasa datos estructurados por si el padre quiere actualizar listas
        if (onNewData && productId !== undefined && from && to) {
          onNewData({
            type: 'TRANSFERRED',
            blockchainId: Number(productId),
            from: from,
            to: to,
            timestamp: Date.now(),
            isVerified: true
          })
        }
      })
    }
  })

  // Escucha ProductDeleted
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'ProductDeleted',
    onLogs(logs) {
      logs.forEach((log) => {
        const { productId } = log.args
        onEvent(`Producto #${productId} eliminado`, 'DELETED')
        // Pasa datos estructurados por si el padre quiere actualizar listas
        if (onNewData && productId !== undefined) {
          onNewData({
            type: 'DELETED',
            blockchainId: Number(productId),
            timestamp: Date.now(),
            isVerified: true
          })
        }
      })
    }
  })
}