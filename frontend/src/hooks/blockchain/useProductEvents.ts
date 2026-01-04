'use client'

import { useWatchContractEvent } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract'

type EventCallback = (message: string, type: 'success' | 'info' | 'warning') => void

export function useProductEvents(onEvent: EventCallback) {
  // Escucha ProductRegistered
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    eventName: 'ProductRegistered',
    onLogs(logs) {
      logs.forEach((log) => {
        const { productId, owner } = log.args
        onEvent(`Producto #${productId} registrado por ${owner?.slice(0, 6)}...`, 'success')
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
        onEvent(`Producto #${productId} transferido de ${from?.slice(0, 6)}... a ${to?.slice(0, 6)}...`, 'info')
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
        onEvent(`Producto #${productId} eliminado`, 'warning')
      })
    }
  })
}