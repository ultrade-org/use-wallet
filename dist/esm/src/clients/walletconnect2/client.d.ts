import BaseClient from '../base';
import { PROVIDER_ID } from '../../constants';
import type { WalletConnectModalSignOptions } from '@walletconnect/modal-sign-html';
import type { Network } from '../../types/node';
import type { InitParams } from '../../types/providers';
import type { Wallet } from '../../types/wallet';
import type { WalletConnectClientConstructor } from './types';
declare class WalletConnectClient extends BaseClient {
    #private;
    clientOptions?: WalletConnectModalSignOptions;
    network: Network;
    chain: string;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network, chain }: WalletConnectClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, clientStatic, algosdkStatic, network }: InitParams<PROVIDER_ID.WALLETCONNECT>): Promise<BaseClient | null>;
    connect(): Promise<Wallet>;
    reconnect(): Promise<{
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
}
export default WalletConnectClient;
