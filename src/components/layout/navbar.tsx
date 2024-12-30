"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";

import { Button } from "@nextui-org/button";
import dayjs from "dayjs";
import { useAppKitAccount } from "@reown/appkit/react";
import { useLotteryContractStore } from "@/store/lotteryContractStore";
import { useMemo } from "react";

const Navbar = () => {
  const {
    pickWinner,
    enterLottery,

    state: {
      entranceFee,
      contractBalance,
      lotteryEndTime,
      owner,
      lastWinner,
      participants,
    },
  } = useLotteryContractStore();

  const { address, isConnected } = useAppKitAccount();

  const { isEnded, isOwner } = useMemo(() => {
    const isOwner = address?.toLowerCase() === owner?.toLowerCase();

    const solidityTime = dayjs.unix(Number(lotteryEndTime));
    const now = dayjs();

    const isEnded = solidityTime.isBefore(now);
    return { isEnded, isOwner };
  }, [owner, lotteryEndTime, address]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-zinc-900 shadow-md">
        <Popover>
          <PopoverTrigger>
            <Button>Show Contract Info</Button>
          </PopoverTrigger>
          <PopoverContent className="p-4 gap-4">
            <p>Entrance Fee: {entranceFee} ETH</p>
            <p>Contract Balance: {contractBalance} ETH</p>
            {!isEnded && (
              <p>
                Lottery Ends:{" "}
                {dayjs
                  .unix(Number(lotteryEndTime))
                  .format("YYYY-MM-DD HH:mm:ss")}
              </p>
            )}

            {lastWinner && <p>Last Winner: {lastWinner}</p>}

            {isEnded && isOwner && (
              <Button onPress={pickWinner}>Pick Winner</Button>
            )}

            {isConnected &&
              !isEnded &&
              !isOwner &&
              !participants?.includes(address?.toLowerCase() || "") && (
                <Button onPress={enterLottery}>Enter Lottery</Button>
              )}
          </PopoverContent>
        </Popover>
        {/* @ts-ignore */}
        <appkit-button />
      </nav>
    </>
  );
};

export default Navbar;
