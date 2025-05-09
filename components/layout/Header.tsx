import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "flowbite-react"
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Header = () => {

  const wallet = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    if (wallet.connected) {
      wallet.disconnect();
      toast.success('Wallet disconnected!')
    } else {
      setVisible(true);
    }
  }

  useEffect(() => {
    if (wallet.connected) {
      toast.success("Wallet connected!")
    }
  }, [wallet.connected])

  return (
    <nav className="flex items-center justify-between px-3 py-6">
      <Link className="mr-5" href="/">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">MemeTree</h1>
      </Link>
      <Button onClick={handleConnect}>{wallet.connected ? "Disconnect" : "Connet Wallet"}</Button>
    </nav>)
}

export default Header