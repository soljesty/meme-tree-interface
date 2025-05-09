import { PublicKey } from '@solana/web3.js';
import idl from './idl/memetree.json';

const programId = process.env.NEXT_PUBLIC_CONTRACT_PROGRAM || process.exit(1)

const proId = new PublicKey(programId)

export {
  idl,
  proId
}