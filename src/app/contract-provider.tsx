"use client";

import { Eip1193Provider } from "ethers";
import { useAppKitProvider } from "@reown/appkit/react";
import { useEffect } from "react";
import { useLotteryContractStore } from "@/store/lotteryContractStore";

const ContractProvider = ({ children }: { children: React.ReactNode }) => {
  const { walletProvider } = useAppKitProvider<Eip1193Provider | undefined>(
    "eip155"
  );
  const { initContract } = useLotteryContractStore();

  useEffect(() => {
    if (walletProvider) initContract(walletProvider);
  }, [walletProvider]);

  return <>{children}</>;
};

export default ContractProvider;
