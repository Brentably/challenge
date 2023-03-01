import * as dotenv from 'dotenv';
dotenv.config()
import {ethers} from 'ethers'



export default function generateWallets(MNEMONIC:string = process.env.MNEMONIC!):ethers.Wallet[] {
  let wallets:ethers.Wallet[] = []
  for(let i = 0; i<100; i++) {
    let wallet = ethers.Wallet.fromMnemonic(MNEMONIC, `m/44'/60'/0'/0/${i}`)
    wallets.push(wallet)
  }
  return wallets
}

generateWallets()