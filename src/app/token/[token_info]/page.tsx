"use client";
import { useEffect, useState } from "react";
import { Modal, Button } from "flowbite-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { withdraw } from "../../../../contract/instruction";
import { PublicKey } from "@solana/web3.js";
import Header from "../../../../components/layout/Header";

export default function TokenInfo({ params }: { params: { token_info: string } }) {
  const treasury = process.env.NEXT_PUBLIC_TREASURY;
  const [tokenData, setTokenData] = useState({
    tokenName: '',
    subdomain: '',
    tokenAddress: '',
    signer: '',
    description: '',
    logo: '',
    twitter: '',
    telegram: '',
    discord: '',
    mWallet: ''
  });
  const [openModal, setOpenModal] = useState(false);
  const wallet = useWallet()
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const [targetWallet, setTargetWallet] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const submitNewToken = async () => {
    let sig;

    if (anchorWallet && treasury) {
      sig = await withdraw(
        connection,
        anchorWallet,
        new PublicKey(tokenData.tokenAddress),
        new PublicKey(treasury),
        new PublicKey(targetWallet),
        parseFloat(amount) * 10 ** 9
      )
    }

    if (sig) {
      toast.success(sig)
    } else {
      toast.error("Transaction failed")
    }

    setOpenModal(false)

  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tokens/${params.token_info}`)
      .then(value => {
        console.log(value);
        setTokenData(value.data);

        console.log(tokenData)
        console.log(wallet.publicKey, " , ", tokenData.signer)
      })
  }, [])


  return (
    <main className="">
      <Header />

      {
        wallet.publicKey?.toBase58() == tokenData.signer &&
        <Button className="mx-3" onClick={() => setOpenModal(true)}>Withdraw</Button>
      }
      <div className="p-10 flex">

        <div>
          <div className="p-5 m-2 h-full">
            <div className="grid grid-cols-4 gap-5 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Subdomain :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.subdomain}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-5 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Token Mint Address :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.tokenAddress}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-4 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Creator :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.signer}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-4 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Description :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.description}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-4 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Marketing Wallet :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.mWallet}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-4 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Twitter :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.twitter}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-4 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Telegram :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.telegram}
              </a>
            </div>
            <div className="grid grid-cols-4 gap-4 auto-cols-max">
              <a className="font-normal col-span-1 text-gray-700 dark:text-gray-400">
                Discord :
              </a>
              <a className="font-normal col-span-3 text-gray-700 dark:text-gray-400">
                {tokenData.discord}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add List</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 flex flex-col gap-3">
            <div className="w-full gap-2">
              <div className="mb-2">
                Target Wallet
                <input
                  type="text"
                  placeholder="Input target wallet"
                  className="w-full rounded-md"
                  value={targetWallet}
                  onChange={(e: any) => setTargetWallet(e.target.value)}
                />
              </div>
              <div className="mb-2">
                Amount
                <input
                  type="text"
                  placeholder="Input sol amount"
                  className="w-full rounded-md"
                  value={amount}
                  onChange={(e: any) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitNewToken}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </main >
  )
}