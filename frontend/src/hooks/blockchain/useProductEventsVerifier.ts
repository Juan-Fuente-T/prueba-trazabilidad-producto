'use client'

import { useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'
import { Event, TypeEvent } from '@/types/events'

type EventCallback = (message: string, type: TypeEvent) => void
// Callback para pasar los datos crudos y actualizar listas
type DataCallback = (eventData: Partial<Event> & { txHash: string }) => void

export function useProductEventsVerifier(onEvent: EventCallback, onNewData?: DataCallback) {  // Escucha ProductRegistered
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'ProductRegistered',
    onLogs(logs) {
      logs.forEach((log) => {
        const { productId, owner } = log.args
        const txHash = log.transactionHash

        onEvent(`Producto #${productId} registrado por ${owner?.slice(0, 6)}...`, 'CREATED')

        // Pasa datos estructurados por si el padre quiere actualizar listas
        if (onNewData && productId !== undefined && owner) {
          onNewData({
            type: 'CREATED',
            productBlockchainId: Number(productId),
            toAddress: owner,
            timestamp: Date.now(),
            isVerified: true,
            txHash: txHash
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
        const txHash = log.transactionHash

        onEvent(`Producto #${productId} transferido de ${from?.slice(0, 6)}... a ${to?.slice(0, 6)}...`, 'TRANSFERRED')

        // Pasa datos estructurados por si el padre quiere actualizar listas
        if (onNewData && productId !== undefined && from && to) {
          onNewData({
            type: 'TRANSFERRED',
            productBlockchainId: Number(productId),
            fromAddress: from,
            toAddress: to,
            timestamp: Date.now(),
            isVerified: true,
            txHash: txHash
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
        const txHash = log.transactionHash

        onEvent(`Producto #${productId} eliminado`, 'DELETED')

        // Pasa datos estructurados por si el padre quiere actualizar listas
        if (onNewData && productId !== undefined) {
          onNewData({
            type: 'DELETED',
            productBlockchainId: Number(productId),
            timestamp: Date.now(),
            isVerified: true,
            txHash: txHash
          })
        }
      })
    }
  })
}