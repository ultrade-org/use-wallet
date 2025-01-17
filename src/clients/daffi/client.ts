/**
 * Documentation:
 * https://github.com/RDinitiativ/daffiwallet_connect
 */
import Algod, { getAlgodClient } from '../../algod'
import BaseClient from '../base'
import { DEFAULT_NETWORK, PROVIDER_ID } from '../../constants'
import { debugLog } from '../../utils/debugLog'
import { ICON } from './constants'
import type { DaffiWalletConnect } from '@daffiwallet/connect'
import type { DecodedSignedTransaction, DecodedTransaction, Network } from '../../types/node'
import type { InitParams } from '../../types/providers'
import type { Wallet } from '../../types/wallet'
import type {
  DaffiTransaction,
  DaffiWalletClientConstructor,
  DaffiWalletConnectOptions
} from './types'

class DaffiWalletClient extends BaseClient {
  #client: DaffiWalletConnect
  clientOptions?: DaffiWalletConnectOptions
  network: Network

  constructor({
    metadata,
    client,
    clientOptions,
    algosdk,
    algodClient,
    network
  }: DaffiWalletClientConstructor) {
    super(metadata, algosdk, algodClient)
    this.#client = client
    this.clientOptions = clientOptions
    this.network = network
    this.metadata = DaffiWalletClient.metadata
  }

  static metadata = {
    id: PROVIDER_ID.DAFFI,
    name: 'Daffi',
    icon: ICON,
    isWalletConnect: true
  }

  static async init({
    clientOptions,
    algodOptions,
    clientStatic,
    algosdkStatic,
    network = DEFAULT_NETWORK
  }: InitParams<PROVIDER_ID.DAFFI>) {
    try {
      debugLog(`${PROVIDER_ID.DAFFI.toUpperCase()} initializing...`)

      if (!clientStatic) {
        throw new Error('Daffi Wallet provider missing required property: clientStatic')
      }

      const DaffiWalletConnect = clientStatic

      const algosdk = algosdkStatic || (await Algod.init(algodOptions)).algosdk
      const algodClient = getAlgodClient(algosdk, algodOptions)

      const daffiWallet = new DaffiWalletConnect({
        ...(clientOptions && clientOptions)
      })

      const provider = new DaffiWalletClient({
        metadata: DaffiWalletClient.metadata,
        client: daffiWallet,
        clientOptions,
        algosdk,
        algodClient,
        network
      })

      debugLog(`${PROVIDER_ID.DAFFI.toUpperCase()} initialized`, '✅')

      return provider
    } catch (e) {
      console.error('Error initializing...', e)
      return null
    }
  }

  async connect(onDisconnect: () => void): Promise<Wallet> {
    const accounts = await this.#client.connect()

    this.#client.connector?.on('disconnect', onDisconnect)

    if (accounts.length === 0) {
      throw new Error(`No accounts found for ${DaffiWalletClient.metadata.id}`)
    }

    const mappedAccounts = accounts.map((address: string, index: number) => ({
      name: `Daffi Wallet ${index + 1}`,
      address,
      providerId: DaffiWalletClient.metadata.id
    }))

    return {
      ...DaffiWalletClient.metadata,
      accounts: mappedAccounts
    }
  }

  async reconnect(onDisconnect: () => void) {
    const accounts = await this.#client.reconnectSession().catch(console.info)

    this.#client.connector?.on('disconnect', onDisconnect)

    if (!accounts) {
      onDisconnect()
      return null
    }

    return {
      ...DaffiWalletClient.metadata,
      accounts: accounts.map((address: string, index: number) => ({
        name: `Daffi Wallet ${index + 1}`,
        address,
        providerId: DaffiWalletClient.metadata.id
      }))
    }
  }

  async disconnect() {
    await this.#client.disconnect()
  }

  async signTransactions(
    connectedAccounts: string[],
    txnGroups: Uint8Array[] | Uint8Array[][],
    indexesToSign?: number[],
    returnGroup = true
  ) {
    // If txnGroups is a nested array, flatten it
    const transactions: Uint8Array[] = Array.isArray(txnGroups[0])
      ? (txnGroups as Uint8Array[][]).flatMap((txn) => txn)
      : (txnGroups as Uint8Array[])

    // Decode the transactions to access their properties.
    const decodedTxns = transactions.map((txn) => {
      return this.algosdk.decodeObj(txn)
    }) as Array<DecodedTransaction | DecodedSignedTransaction>

    const signedIndexes: number[] = []

    // Marshal the transactions,
    // and add the signers property if they shouldn't be signed.
    const txnsToSign = decodedTxns.reduce<DaffiTransaction[]>((acc, txn, i) => {
      const isSigned = 'txn' in txn

      // If the indexes to be signed is specified, designate that it should be signed
      if (indexesToSign && indexesToSign.length && indexesToSign.includes(i)) {
        signedIndexes.push(i)
        acc.push({
          txn: this.algosdk.decodeUnsignedTransaction(transactions[i])
        })
        // If the indexes to be signed is specified, but it's not included in it,
        // designate that it should not be signed
      } else if (indexesToSign && indexesToSign.length && !indexesToSign.includes(i)) {
        acc.push({
          txn: isSigned
            ? this.algosdk.decodeSignedTransaction(transactions[i]).txn
            : this.algosdk.decodeUnsignedTransaction(transactions[i]),
          signers: []
        })
        // If the transaction is unsigned and is to be sent from a connected account,
        // designate that it should be signed
      } else if (!isSigned && connectedAccounts.includes(this.algosdk.encodeAddress(txn['snd']))) {
        signedIndexes.push(i)
        acc.push({
          txn: this.algosdk.decodeUnsignedTransaction(transactions[i])
        })
        // Otherwise, designate that it should not be signed
      } else if (isSigned) {
        acc.push({
          txn: this.algosdk.decodeSignedTransaction(transactions[i]).txn,
          signers: []
        })
      } else if (!isSigned) {
        acc.push({
          txn: this.algosdk.decodeUnsignedTransaction(transactions[i]),
          signers: []
        })
      }

      return acc
    }, [])

    // Sign them with the client.
    const result = await this.#client.signTransaction([txnsToSign])

    // Join the newly signed transactions with the original group of transactions.
    const signedTxns = transactions.reduce<Uint8Array[]>((acc, txn, i) => {
      if (signedIndexes.includes(i)) {
        const signedByUser = result.shift()
        signedByUser && acc.push(signedByUser)
      } else if (returnGroup) {
        acc.push(transactions[i])
      }

      return acc
    }, [])

    return signedTxns
  }

  async signBytes(data: Uint8Array, signer: string) {
    const result = await this.signTransactions([signer], [data])
    return result[0] 
  }
}

export default DaffiWalletClient
