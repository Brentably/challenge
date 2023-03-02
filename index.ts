import generateWallets from "./generateWallets"
import { Database } from "./types"
import databaseJSON from './database.json'
import { ethers } from "ethers"
import fs from 'fs'

const startTime = Date.now()
const BATCH_SIZE = 1000
let counter = 0
const database:Database = JSON.parse(JSON.stringify(databaseJSON))
let keysInUse = new Set()

// function signs and "writes" a single record in the db
async function signAndWrite(wallet:ethers.Wallet, index: number) {
  if(keysInUse.has(wallet.address)) throw new Error('multiple keys signing at once')
  keysInUse.add(wallet.address)
  const signature = await wallet?.signMessage(JSON.stringify(database.data[index]))
    database.data[index].signature = signature
    // if(!wallet!.address) throw new Error("line 23")
    database.data[index].signerPubKey = wallet!.address
    // console.log(database.data[counter])

  keysInUse.delete(wallet.address)
}

// 
async function signBatches(wallet:ethers.Wallet) {
  console.log(wallet.address, counter)
  console.log(process.pid)
  while(counter < database.data.length - 1) {
    let initIndex = counter
    let endIndex = counter + 10
    // increment the counter
    counter = counter + 10
    // if(wallet.address=='0x7d041c66462857B38C948858719d285383829661') console.log(counter)
    
    // sign the records, one by one
    for(let index = initIndex; index < endIndex; index++) {
      await signAndWrite(wallet, index)
    }
  }
}


export default async function main() {
  const wallets = generateWallets()
  
  const allPromises = []
 
  for(let wallet of wallets) {
    let p = signBatches(wallet)
    allPromises.push(p)
  }

  await Promise.all(allPromises) // wait till everything is done
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