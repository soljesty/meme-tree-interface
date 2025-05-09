"use client";
import { Card } from "flowbite-react";

export interface SubDomainListProps {
  address: string
  daily_volume: Number
  decimals: Number
  freeze_authority: string
  logoURI: string
  mint_authority: string
  name: string
  symbol: string
  tags: string[]
}

const SubDomainList = ({ data }: any) => {

  const {
    description,
    logo,
    mWallet,
    subdomain
  } = data;

  return (
    <a href={`/token/${subdomain}`}>
      <div className="p-5 m-2 h-full">
        <Card className="max-w-sm h-full max-md:mx-auto" imgSrc={logo} horizontal>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {"Token name"}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Subdomain : {subdomain}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Description : {description}
          </p>
        </Card>
      </div>
    </a>
  )
}

export default SubDomainList