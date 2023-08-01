import pera from './pera';
import daffi from './daffi';
import myalgo from './myalgo';
import defly from './defly';
import exodus from './exodus';
import algosigner from './algosigner';
import walletconnect from './walletconnect2';
import kmd from './kmd';
import mnemonic from './mnemonic';
export { pera, myalgo, defly, exodus, algosigner, walletconnect, kmd, mnemonic };
declare const _default: {
    [x: string]: typeof pera | typeof myalgo | typeof defly | typeof exodus | typeof algosigner | typeof walletconnect | typeof kmd | typeof mnemonic | typeof daffi;
};
export default _default;
