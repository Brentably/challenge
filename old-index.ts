import { Wallet } from 'ethers'
import databaseJSON from './database.json'
import generateWallets from './generateWallets'
import { Database, WalletsToQueues } from './types'
import fs from 'fs'
import signAndWrite from './signAndWrite'

const startTime = Date.now()
const BATCH_SIZE = 10
let keysInUse = new Set()

export async function main() {
const wallets = generateWallets()

const database:Database = JSON.parse(JSON.stringify(databaseJSON))

// while there are still unsigned messages, we want to keep this process of iterating through keys and signing batches going
const allPromises = []
let counter = 0;
while(counter < database.data.length) {
  let currentWallet = wallets.pop()
  wallets.unshift(currentWallet!)

  for(let i = 0; i < BATCH_SIZE; i++) {
    let promise = signAndWrite(currentWallet!, database, counter)
    allPromises.push(promise)
    counter++
  }
}

await Promise.all(allPromises)
fs.writeFileSync('database.json', JSON.stringify(database))
console.log(Date.now() - startTime, 'ms')
// for(let record of database.data) {
//   const signedRecord = await firstSigner!.signMessage(JSON.stringify(record))
//   console.log(record, signedRecord)
// }

}
main()