import { Network } from '../types/node';
export declare enum PROVIDER_ID {
    KMD = "kmd",
    PERA = "pera",
    DAFFI = "daffi",
    MYALGO = "myalgo",
    ALGOSIGNER = "algosigner",
    DEFLY = "defly",
    EXODUS = "exodus",
    WALLETCONNECT = "walletconnect",
    MNEMONIC = "mnemonic"
}
export declare const DEFAULT_NETWORK: Network;
export declare const DEFAULT_NODE_BASEURL = "https://mainnet-api.algonode.cloud";
export declare const DEFAULT_NODE_TOKEN = "";
export declare const DEFAULT_NODE_PORT = "";
