export type Record = {
  numString: string
  signature?: string | Buffer
  signerPubKey?: string
}

export type Database = {data: Record[]}

export type WalletsToQueues = {[key: string]: Array<()=>Promise<void>>}

export type keyPair = {
  public: string, 
  private: string
}