 import { keccak256, toHex } from 'viem'

 export const calculateHash = (name: string, description: string) => {
    const uniqueString = `${name}-${description}-${Date.now()}`
    return keccak256(toHex(uniqueString))
  }