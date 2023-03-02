import generateWallets, { generateKeys } from "./generateWallets"
import { Database, keyPair } from "./types"
import databaseJSON from './database.json'
import { ethers } from "ethers"
import fs from 'fs'
import crypto from 'crypto'

const startTime = Date.now()
const BATCH_SIZE = 1000
let counter = 0
const database:Database = JSON.parse(JSON.stringify(databaseJSON))
let keysInUse = new Set()

// function signs and "writes" a single record in the db
async function signAndWrite(key:keyPair, index: number):Promise<void> {
  if(keysInUse.has(key.public)) throw new Error(`same key used concurrently: ${key.public}`)
  keysInUse.add(key.public)
  console.log(keysInUse)
  // const signature = await wallet?.signMessage(JSON.stringify(database.data[index]))

  return new Promise((res, rej) => {
    crypto.sign(null, Buffer.from(JSON.stringify(database.data[index])), key.private, (err, data) => {
    if(err) throw err
    console.error('testing')
    database.data[index].signature = data
    keysInUse.delete(key.public)
    res()
  })
})
    // if(!wallet!.address) throw new Error("line 23")
    // database.data[index].signerPubKey = wallet!.address
    // console.log(database.data[counter])
}

// 
async function signBatches(key:keyPair) {
  console.log(process.pid)
  while(counter < database.data.length - 1) {
    let initIndex = counter
    let endIndex = counter + 10
    // increment the counter
    counter = counter + 10
    // if(wallet.address=='0x7d041c66462857B38C948858719d285383829661') console.log(counter)
    
    // sign the records, one by one
    for(let index = initIndex; index < endIndex; index++) {
      console.log(`signing started for ${key.public}`)
      await signAndWrite(key, index)
      console.log(`signing done for ${key.public}`)
    }
  }
}


export default async function main() {
  const keys = await generateKeys()
  
  const allPromises = []
 
  for(let key of keys) {
    let p = signBatches(key)
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