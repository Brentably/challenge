import {ethers} from 'ethers'
import { Database } from './types';
export default async function signAndWrite(wallet:ethers.Wallet, database:Database, counter: number) {
  const signature = await wallet?.signMessage(JSON.stringify(database.data[counter]))
    database.data[counter].signature = signature
    // if(!wallet!.address) throw new Error("line 23")
    database.data[counter].signerPubKey = wallet!.address
    // console.log(database.data[counter])
}