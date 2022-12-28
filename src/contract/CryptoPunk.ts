import { ethers } from 'ethers';
import ContractABI from '../../abi/cryptopunk.json';

class CryptoPunk {
  private contract: ethers.Contract;

  public init() {
    const contractAddress = '0x35054f194Afab6B07fbADdA4c040631Afb4d62E9';
    const provider = new ethers.providers.WebSocketProvider(
      'wss://goerli.infura.io/ws/v3/' + process.env.INFURA_KEY
    );
    this.contract = new ethers.Contract(contractAddress, ContractABI, provider);
  }

  public getBalance(address: string) {
    return this.contract.balanceOf(address);
  }

  public synchronize(callback) {
    this.contract.on('Transfer', (from, to, value) => {
      callback(from, to, value.toNumber());
    });
  }
}

export const cryptoPunk = new CryptoPunk();
