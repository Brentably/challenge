import generateWallets from "./generateWallets"
import { Database } from "./types"
import databaseJSON from './database.json'
import { ethers } from "ethers"
// import signAndWrite from "./signAndWrite"
import fs from 'fs'
import {exec} from 'child_process'

const startTime = Date.now()
const BATCH_SIZE = 10
let counter = 0
const database:Database = JSON.parse(JSON.stringify(databaseJSON))
let keysInUse = new Set()


async function signAndWrite(wallet:ethers.Wallet, database:Database, index: number) {
  if(keysInUse.has(wallet.address)) throw new Error('multiple keys signing at once')
  keysInUse.add(wallet.address)
  const signature = await wallet?.signMessage(JSON.stringify(database.data[index]))
    database.data[index].signature = signature
    // if(!wallet!.address) throw new Error("line 23")
    database.data[index].signerPubKey = wallet!.address
    // console.log(database.data[counter])

  keysInUse.delete(wallet.address)
}

async function signBatches(wallet:ethers.Wallet, database:Database) {
  console.log(wallet.address, counter)
  while(counter < database.data.length - 1) {
    let initIndex = counter
    let endIndex = counter + 10
    // increment the counter
    if(wallet.address=='0x7d041c66462857B38C948858719d285383829661') console.log(counter)
    counter = counter + 10
    // sign the things
    
    for(let index = initIndex; index < endIndex; index++) {
      await signAndWrite(wallet, database, index)
    }
    // continue
  }
}


export default async function main() {
  const wallets = generateWallets()
  
  const allPromises = []
 
  for(let wallet of wallets) {
    let p = signBatches(wallet, database)
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