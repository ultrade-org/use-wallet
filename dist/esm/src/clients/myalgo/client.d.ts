import BaseClient from '../base';
import { PROVIDER_ID } from '../../constants';
import type { Network } from '../../types/node';
import type { InitParams } from '../../types/providers';
import type { MyAlgoConnectOptions, MyAlgoWalletClientConstructor } from './types';
declare class MyAlgoWalletClient extends BaseClient {
    #private;
    clientOptions?: MyAlgoConnectOptions;
    network: Network;
    constructor({ metadata, client, clientOptions, algosdk, algodClient, network }: MyAlgoWalletClientConstructor);
    static metadata: {
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    };
    static init({ clientOptions, algodOptions, clientStatic, algosdkStatic, network }: InitParams<PROVIDER_ID.MYALGO>): Promise<BaseClient | null>;
    connect(): Promise<{
        accounts: {
            providerId: PROVIDER_ID;
            address: string;
            name: string;
        }[];
        id: PROVIDER_ID;
        name: string;
        icon: string;
        isWalletConnect: boolean;
    }>;
    reconnect(): Promise<null>;
    disconnect(): Promise<void>;
    signTransactions(connectedAccounts: string[], transactions: Uint8Array[], indexesToSign?: number[], returnGroup?: boolean): Promise<Uint8Array[]>;
}
export default MyAlgoWalletClient;
