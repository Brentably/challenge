import { Wallet } from 'ethers'
import databaseJSON from './database.json'
import generateWallets from './generateWallets'
import { Database } from './types'
import fs from 'fs'

const BATCH_SIZE = 10

export async function main() {
const wallets = generateWallets()

const database:Database = JSON.parse(JSON.stringify(databaseJSON))

// while there are still unsigned messages, we want to keep this process of iterating through keys and signing batches going
let counter = 0;
while(counter < database.data.length) {
  let currentWallet = wallets.pop()
  wallets.unshift(currentWallet!)

  for(let i = 0; i < BATCH_SIZE; i++) {
    const signature = await currentWallet?.signMessage(JSON.stringify(database.data[i]))
    database.data[counter].signature = signature
    if(!currentWallet!.address) throw new Error("line 23")
    database.data[counter].signerPubKey = currentWallet!.address
    console.log(database.data[counter])
    counter++
  }
}

fs.writeFileSync('database.json', JSON.stringify(database))
// for(let record of database.data) {
//   const signedRecord = await firstSigner!.signMessage(JSON.stringify(record))
//   console.log(record, signedRecord)
// }

}
main()