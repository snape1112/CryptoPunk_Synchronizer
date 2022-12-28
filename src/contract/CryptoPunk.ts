import { ethers } from "ethers";
const contractABI = require('../../abi/cryptopunk.json');

type BalanceDTO = {
    balance?: number,
    message?: string,
    error: Boolean
}

class CryptoPunk {
    private contract: ethers.Contract;

    constructor() {
        const contractAddress = "0x35054f194Afab6B07fbADdA4c040631Afb4d62E9";
        const provider = new ethers.providers.WebSocketProvider('wss://goerli.infura.io/ws/v3/' + process.env.INFURA_KEY);
        this.contract = new ethers.Contract(contractAddress, contractABI, provider);
    }

    public getBalance(address: string) {
        return this.contract.balanceOf(address);
    }

    public synchronize(callback: Function) {
        this.contract.on("Transfer", (from, to, value) => {
            callback(from, to, value.toNumber());
        });
    }
}

export const cryptoPunk = new CryptoPunk();