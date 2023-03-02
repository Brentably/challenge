import * as dotenv from 'dotenv';
dotenv.config()
import {ethers} from 'ethers'
import crypto from 'crypto'
import { keyPair } from './types';


// generates an array of wallets from a mnemonic
export default function generateWallets(MNEMONIC:string = process.env.MNEMONIC!):ethers.Wallet[] {
  let wallets:ethers.Wallet[] = []
  for(let i = 0; i<100; i++) {
    let wallet = ethers.Wallet.fromMnemonic(MNEMONIC, `m/44'/60'/0'/0/${i}`)
    wallets.push(wallet)
  }
  return wallets
}

export async function generateKeys():Promise<keyPair[]> {
  let keys:keyPair[] = []
  const promises = []
  for(let i = 0; i<100; i++) {
    let p = new Promise((res, rej) => {
      crypto.generateKeyPair('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: `${i}${i}`,
        }}, (err, pubkey, prvkey) => {
        keys.push({public: pubkey, private: prvkey})
        res(null)})
    })
    promises.push(p)
  }
  await Promise.all(promises)
  return keys
}

generateWallets()