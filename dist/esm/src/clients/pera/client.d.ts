import BaseClient from '../base';
import { PROVIDER_ID } from '../../constants';
import type { Network } from '../../types/node';
import type { InitParams } from '../../types/providers';
import type { Wallet } from '../../types/wallet';
import type { PeraWalletClientConstructor, PeraWalletConnectOptions } from './types';
declare class PeraWalletClient extends BaseClient {
    #private;
    clientOptions?: PeraWalletConnectOptions;
    network: Network;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network }: PeraWalletClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, clientStatic, algosdkStatic, network }: InitParams<PROVIDER_ID.PERA>): Promise<BaseClient | null>;
    connect(onDisconnect: () => void): Promise<Wallet>;
    reconnect(onDisconnect: () => void): Promise<{
        accounts: {
            name: string;
            address: string;
            providerId: PROVIDER_ID;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    } | null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], txnGroups: Uint8Array[] | Uint8Array[][], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
    signBytes(data: Uint8Array, signer: string): Promise<Uint8Array>;
}
export default PeraWalletClient;
