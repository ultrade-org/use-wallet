import type { WalletConnectModalSign, WalletConnectModalSignOptions } from '@walletconnect/modal-sign-html';
import type algosdk from 'algosdk';
import type { Network } from '../../types/node';
import type { Metadata } from '../../types/wallet';
export type WalletConnectClientConstructor = {
    metadata: Metadata;
    client: WalletConnectModalSign;
    clientOptions: WalletConnectModalSignOptions;
    algosdk: typeof algosdk;
    algodClient: algosdk.Algodv2;
    network: Network;
    chain: string;
};
export type WalletConnectTransaction = {
    txn: string;
    signers?: string[];
    message?: string;
};
export interface SignTxnOpts {
    message?: string;
}
export type SignTxnParams = [WalletConnectTransaction[], SignTxnOpts?];
export interface JsonRpcRequest<T = any> {
    id: number;
    jsonrpc: string;
    method: string;
    params: T;
}
