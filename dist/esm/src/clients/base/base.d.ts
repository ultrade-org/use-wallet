import type _algosdk from 'algosdk';
import type { AccountInfo, Asset, ClientOptions, Metadata, Wallet } from '../../types/wallet';
import type { TransactionsArray, TxnInfo } from '../../types/api';
declare abstract class BaseClient {
    algosdk: typeof _algosdk;
    algodClient: _algosdk.Algodv2;
    clientOptions?: ClientOptions;
    keepWCAlive: HTMLAudioElement;
    metadata: Metadata;
    static metadata: Metadata;
    abstract connect(onDisconnect: () => void): Promise<Wallet>;
    abstract disconnect(): Promise<void>;
    abstract reconnect(onDisconnect: () => void): Promise<Wallet | null>;
    abstract signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
    abstract signBytes(data: Uint8Array, signer: string): Promise<Uint8Array>;
    protected constructor(metadata: Metadata, algosdk: typeof _algosdk, algodClient: _algosdk.Algodv2, clientOptions?: ClientOptions);
    healthCheck(): Promise<{}>;
    getAccountInfo(address: string): Promise<AccountInfo>;
    getAssets(address: string): Promise<Asset[]>;
    waitForConfirmation(txId: string, timeout?: number): Promise<{
        'confirmed-round': number;
        'global-state-delta': Record<string, unknown>[];
        'pool-error': string;
        txn: {
            sig: Uint8Array;
            txn: import("../../types/node").Txn;
        };
        txId: string;
    }>;
    decodeTransaction: (txn: string, isSigned: boolean) => _algosdk.Transaction;
    logEncodedTransaction(txn: string, isSigned: boolean): void;
    groupTransactionsBySender(transactions: TransactionsArray): Record<string, TxnInfo[]>;
    sendRawTransactions(transactions: Uint8Array[], waitRoundsToConfirm?: number): Promise<{
        'confirmed-round': number;
        'global-state-delta': Record<string, unknown>[];
        'pool-error': string;
        txn: {
            sig: Uint8Array;
            txn: import("../../types/node").Txn;
        };
        txId: string;
        id: string;
    }>;
    keepWCAliveStart(): Promise<void>;
    keepWCAliveStop(): void;
}
export default BaseClient;
