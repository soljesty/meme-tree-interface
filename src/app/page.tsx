"use client";
import Image from "next/image";
import { Modal, Button, TextInput, Avatar } from "flowbite-react";
import { useEffect, useState } from "react";

import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import axios from "axios";

import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Tokens, { SubDomainListProps } from "../../components/SubDomainList";
import { PublicKey } from '@solana/web3.js'
import { initialize } from "../../contract/instruction";
import { AnchorProvider, Idl, Program, setProvider } from "@coral-xyz/anchor";

import { Metaplex } from '@metaplex-foundation/js';
// import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

// import{ Metadata , findMetadataPda , MPL_TOKEN_METADATA_PROGRAM_ID} from "@metaplex-foundation/mpl-token-metadata";

// import { getPdaMetadataKey } from '@raydium-io/raydium-sdk';



import { idl } from "../../contract/config";
import Header from "../../components/layout/Header";
// import { getMint } from "@solana/spl-token";

let timeCount: any;

const FileElement = () => {
  return (
    <div className="flex flex-col justify-center gap-2 items-center p-4 rounded-md border-2 cursor-pointer">
      <h3 className="cursor-pointer underline whitespace-nowrap">
        Click to upload
      </h3>
      <h4 className="whitespace-nowrap">or drag and drop</h4>
    </div>
  );
};

export default function Home() {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const treasury = process.env.NEXT_PUBLIC_TREASURY;

  const [openModal, setOpenModal] = useState(false);
  const [tokenAvatar, setTokenAvatar] = useState(null);
  const [tokenList, setTokenList] = useState<SubDomainListProps[]>([]);
  const [avatar, setAvatar] = useState("");
  const [tokenName, setTokenName] = useState<string>("");
  const [subdomain, setSubdomain] = useState<string>('');
  const [tokenCA, setTokenCA] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [discord, setDiscord] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [twitter, setTwitter] = useState<string>("");
  const [isValidToken, setIsValidToken] = useState<string>('');
  // const [mkWallet, setMkWallet] = useState<string>('');
  
  const { connection } = useConnection();
  const metaplex = Metaplex.make(connection);
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  
  useEffect(() => {
    axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tokens`)
    .then(value => { console.log(value); setTokenList(value.data) })
  }, [])
  
  useEffect(() => {
    if (timeCount != 0) clearTimeout(timeCount)
      timeCount = setTimeout(async () => {
    try {
      const temp = new PublicKey(tokenCA)
      setIsValidToken('success')

        console.log(temp.toBase58());
        try {
          axios
            .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tokens/metadata` , {pubkey : temp})
            .then(value => { console.log(value); 
              setTokenName(value.data.name)
              setTokenSymbol(value.data.symbol)
              setAvatar(value.data.json.image)
            })

            console.log(avatar);
        
        } catch (error) {
          console.log(error);
          return false
        }

      } catch (error) {
        setIsValidToken('failure')
        setTokenName("-")
        setTokenSymbol("-")
      }
    }, 500);
  }, [tokenCA])


  const avatarChange = (files: any) => {
    const avatarFile = files[0];
    setAvatar(URL.createObjectURL(avatarFile));
    setTokenAvatar(files[0]);
  };

  const submitNewToken = async () => {
    if (tokenCA === "" || description === "") {
      toast.error("Please fill all fields!");
    } else {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tokens/validate`, {
        subdomain: subdomain,
        tokenAddress: tokenCA,
      });

      if (res.data != null) {
        toast.error("Subdomain existed")
        return;
      }

      console.log(treasury)
      if (wallet.connected) {
        let marketingWallet;
        let sig;
        if (anchorWallet && treasury) {

          sig = await initialize(
            connection,
            anchorWallet,
            new PublicKey(tokenCA),
            new PublicKey(treasury),
          )

          const provider = new AnchorProvider(connection, anchorWallet, {});
          setProvider(provider);

          const program = new Program(idl as Idl, provider);


          [marketingWallet] = PublicKey.findProgramAddressSync(
            [Buffer.from("wallet"), anchorWallet.publicKey.toBytes(), new PublicKey(tokenCA).toBytes()],
            program.programId
          );

          console.log(marketingWallet.toBase58())
        }

        if (sig && marketingWallet) {
          try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tokens/create`, {
              tokenName: "",
              subdomain: subdomain,
              tokenAddress: tokenCA,
              description: description,
              logo: avatar,
              twitter: twitter,
              telegram: telegram,
              tokenSymbol: tokenSymbol,
              discord,
              mWallet: marketingWallet.toBase58(),
              signer: wallet.publicKey?.toBase58(),
              wallet: anchorWallet
            });

            if (res) {
              toast.success("New Token successfully created!");
              setOpenModal(false)
              console.log(res.data)
              axios
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tokens`)
                .then(value => {
                  setTokenList(value.data)
                })
            }
          } catch (error) {
            toast.error("Token creating error")
          }
        } else {
          toast.error("transaction failed")
        }
      } else {
        toast.error("Connect wallet !!")
        setOpenModal(false)
      }
    }
  };

  return (
    <main className="">
      <Header />

      <Button className="mx-3" onClick={() => setOpenModal(true)}>Add List</Button>
      <div className="grid px-2 max-md:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-cols-4">
        {tokenList.length > 0 &&
          tokenList.map((ele, idx) => <Tokens data={ele} key={idx}></Tokens>)}
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add List</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 flex flex-col gap-3">
            <div className="flex gap-2 items-center" >
                <div className="flex flex-col gap-2 items-center  w-1/4">
                  <Avatar
                    img={avatar}
                    alt="Token Banner"
                    size={"lg"}
                    rounded
                    bordered color="light"
                  />
                </div>
             
              <div className="flex flex-col justify-between items-center w-full gap-4">
                <div className="flex flex-col w-full gap-1">
                  Subdomain *
                  <TextInput
                    type="text"
                    placeholder="Enter Subdomain"
                    className="w-full rounded-md"
                    value={subdomain}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubdomain(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  Token CA *
                  <TextInput
                    type="text"
                    placeholder="Enter mint address"
                    className="w-full rounded-md"
                    value={tokenCA}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenCA(e.target.value)}
                    color={isValidToken}
                    helperText={
                      isValidToken && (
                        <>
                          {isValidToken == 'failure' ? <span className="font-medium">Invalid Address</span> : ""}
                        </>)
                    }
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  Token Name
                  <TextInput
                    type="text"
                    placeholder="Enter Symbol"
                    className="w-full rounded-md"
                    value={tokenName}
                    disabled
                    readOnly
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  Token Symbol
                  <TextInput
                    type="text"
                    placeholder="Enter Symbol"
                    className="w-full rounded-md"
                    value={tokenSymbol}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              Description *
              <textarea
                name="description"
                placeholder="Say something about the token here"
                rows={5}
                className="rounded-md"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex w-full gap-2 items-center justify-between">
              <div className="flex flex-col w-1/3 gap-1">
                Discord
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-full rounded-md"
                  value={discord}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscord(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/3 gap-1">
                Telegram
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-full rounded-md"
                  value={telegram}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegram(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/3 gap-1">
                Twitter
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-full rounded-md"
                  value={twitter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwitter(e.target.value)}
                />
              </div>
            </div>
            {/* <div className="flex flex-col w-full gap-1">
              Marketing Wallet
              <input
                type="text"
                placeholder="Optional"
                className="w-full rounded-md"
                value={mkWallet}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMkWallet(e.target.value)}
              />
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitNewToken}>Submit</Button>
        </Modal.Footer>
      </Modal>

    </main>
  );
}