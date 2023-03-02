export type Record = {
  numString: string
  signature?: string
  signerPubKey?: string
}

export type Database = {data: Record[]}

export type WalletsToQueues = {[key: string]: Array<()=>Promise<void>>}
