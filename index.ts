import generateWallets from "./generateWallets"
import { Database } from "./types"
import databaseJSON from './database.json'
import { ethers } from "ethers"
import fs from 'fs'

const startTime = Date.now()
const BATCH_SIZE = 10
let counter = 0
const database:Database = JSON.parse(JSON.stringify(databaseJSON))
let keysInUse = new Set()

// function signs and "writes" a single record in the db
async function signAndWrite(wallet:ethers.Wallet, index: number) {
  console.log(`signing record ${index}`)
  if(keysInUse.has(wallet.address)) throw new Error('same key signing multiple records at once :/')
  keysInUse.add(wallet.address)

  const signature = await wallet?.signMessage(JSON.stringify(database.data[index]))
    database.data[index].signature = signature
    // if(!wallet!.address) throw new Error("line 23")
    database.data[index].signerPubKey = wallet!.address
    // console.log(database.data[counter])

  keysInUse.delete(wallet.address)
}

// function marks a batch X size for signing and loops over each record, signing them individually
async function signBatches(wallet:ethers.Wallet) {
  console.log(wallet.address, counter)
  console.log(process.pid)

  while(counter < database.data.length - 1) {
    const initIndex = counter
    const endIndex = counter + BATCH_SIZE
    // increment the counter
    counter = counter + BATCH_SIZE
    // if(wallet.address=='0x7d041c66462857B38C948858719d285383829661') console.log(counter)
    
    // sign the records, one by one
    for(let index = initIndex; index < endIndex; index++) {
      if(index > database.data.length - 1) continue // for when 100k isn't divisible by the batch size. This last batch will be a smaller size but will still get signed
      await signAndWrite(wallet, index)
    }
  }
}


export default async function main() {
  const wallets = generateWallets()
  
  const allPromises = []
 
  // for every wallet a signing process is started
  for(let wallet of wallets) {
    let p = signBatches(wallet)
    allPromises.push(p)
  }

  await Promise.all(allPromises) // wait till database is fully signed before rewriting data
  fs.writeFileSync('database.json', JSON.stringify(database))
  console.log(Date.now() - startTime, 'milliseconds')
}

main()





// function testFunc() {
//   let counter = 10
//   function something() {
//     counter += 10
//   }
//   something()
//   console.log(counter)
// }

// testFunc()