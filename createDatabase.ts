// create a database with 100k records to be signed.
import fs from 'fs'

interface Record {
  numString: string
  singature?: string
}

let database:{data: Record[]} = {data: []}

for(let i = 0; i<100000; i++) {
  let number = String(i)
  database.data.push({numString: number})
}



fs.writeFileSync('database.json', JSON.stringify(database))

