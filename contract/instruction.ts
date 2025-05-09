import {
  SystemProgram,
  PublicKey,
  Transaction,
  Connection,
  ComputeBudgetProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
// import { getBozoProgram } from "./utils";

// import * as instructions from "./types";
import * as anchor from "@coral-xyz/anchor";
import {
  AnchorProvider,
  Idl,
  Program,
  setProvider,
  BN,
} from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";

import { idl, proId } from "./config";


export const initialize = async (
  connection: Connection,
  wallet: AnchorWallet,
  myToken: PublicKey,
  treasuryWallet: PublicKey
) => {
  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);

  const program = new Program(idl as Idl, provider);

  const aWallet: PublicKey = new PublicKey(wallet.publicKey);

  const [pdaWallet] = PublicKey.findProgramAddressSync(
    [aWallet.toBytes(), myToken.toBytes()],
    program.programId
  );

  const [marketingWallet] = PublicKey.findProgramAddressSync(
    [Buffer.from("wallet"), aWallet.toBytes(), myToken.toBytes()],
    program.programId
  );

  console.log("pdaWallet ; ", pdaWallet.toBase58(), " , ", marketingWallet.toBase58());

  const transaction = new Transaction().add(
    ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 200_000 })
  )
  console.log("========1 , ", aWallet)

  // Add your test here.
  const instruction = await program.methods
    .initialize(treasuryWallet)
    .accounts({
      pdaWallet,
      marketingWallet,
      myToken: myToken,
      treasury: treasuryWallet,
    })
    .instruction()
  console.log("========2", transaction)

  transaction.add(instruction);
  try {
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    transaction.feePayer = wallet.publicKey
    console.log(await connection.simulateTransaction(transaction))
    if (wallet.signTransaction) {
      const signedTx = await wallet.signTransaction(transaction)
      const sTx = signedTx.serialize()
      const signature = await connection.sendRawTransaction(sTx, { skipPreflight: true })

      const blockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        signature,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }, "confirmed");
      console.log("Successfully initialized.\n Signature: ", signature);

      return signature;
    }
  } catch (error) {
    console.log("Error in lock transaction", error)
    return null;
  }
};

export const withdraw = async (
  connection: Connection,
  wallet: AnchorWallet,
  myToken: PublicKey,
  treasuryWallet: PublicKey,
  targetingWallet: PublicKey,
  amount: number
) => {
  const provider = new AnchorProvider(connection, wallet, {});
  setProvider(provider);

  const program = new Program(idl as Idl, provider);

  const aWallet: PublicKey = new PublicKey(wallet.publicKey);

  const [pdaWallet] = PublicKey.findProgramAddressSync(
    [aWallet.toBytes(), myToken.toBytes()],
    program.programId
  );

  const [marketingWallet] = PublicKey.findProgramAddressSync(
    [Buffer.from("wallet"), aWallet.toBytes(), myToken.toBytes()],
    program.programId
  );

  console.log("pdaWallet ; ", pdaWallet.toBase58(), " , ", marketingWallet.toBase58());

  const transaction = new Transaction().add(
    ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 200_000 })
  )
  console.log("========1 , ", aWallet)

  const instruction = await program.methods
    .withdraw(new BN(amount))
    .accounts({
      pdaWallet,
      marketingWallet,
      myToken: myToken,
      treasury: treasuryWallet,
      targetWallet: targetingWallet
    })
    .instruction()

  transaction.add(instruction);

  try {
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
    transaction.feePayer = wallet.publicKey
    console.log("Simulation:", await connection.simulateTransaction(transaction))
    if (wallet.signTransaction) {
      const signedTx = await wallet.signTransaction(transaction)
      const sTx = signedTx.serialize()
      const signature = await connection.sendRawTransaction(sTx, { skipPreflight: true })

      const blockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction({
        signature,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
      }, "confirmed");
      console.log("Successfully withdraw.\n Signature: ", signature);

      return signature;
    }
  } catch (error) {
    console.log("Error in lock transaction", error)
    return null;
  }
};