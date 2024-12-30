"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useEffect, useState } from "react";

import Blockies from "react-blockies";
import { EmptyState } from "@/components/empty-state/empty-state";
import { LoserMessage } from "@/components/loser-message/loser-message";
import NotConnected from "@/components/not-connected/not-connected";
import { OwnerModal } from "@/components/owner-message/owner-message";
import { WinnerMessage } from "@/components/winner-message/winner-message";
import { formatUnits } from "ethers";
import toast from "react-hot-toast";
import { triggerConfetti } from "@/utils/trigger-confetti";
import { useAppKitAccount } from "@reown/appkit/react";
import { useDisclosure } from "@nextui-org/modal";
import { useLotteryContractStore } from "@/store/lotteryContractStore";

export default function Home() {
  const { isConnected, address } = useAppKitAccount();
  const [amountWon, setAmountWon] = useState<string>("0");
  const [winner, setWinner] = useState<string | null>(null);

  const {
    isOpen: isOwnerModalOpen,
    onOpen: openOwnerModal,
    onClose: closeOwnerModal,
  } = useDisclosure();
  const {
    isOpen: isWinnerModalOpen,
    onOpen: openWinnerModal,
    onClose: closeWinnerModal,
  } = useDisclosure();

  const {
    isOpen: isLoserModalOpen,
    onOpen: openLoserModal,
    onClose: closeLoserModal,
  } = useDisclosure();

  const {
    state: { participants, contract, owner },
    addNewParticipant,
    setState,
    getContractBalance,
    enterLottery,
    getLotteryEndTime,
  } = useLotteryContractStore();

  useEffect(() => {
    if (!contract) return;

    contract?.on("Entered", (data) => {
      addNewParticipant(data);
      toast.dismiss();
    });

    contract?.on("Winner", (winner, amountWon) => {
      if (owner?.toLowerCase() === address?.toLowerCase()) {
        setAmountWon(formatUnits(amountWon, 18));
        setWinner(winner);
        openOwnerModal();
      } else if (winner.toLowerCase() === address?.toLowerCase()) {
        setAmountWon(formatUnits(amountWon, 18));
        openWinnerModal();
        triggerConfetti(10);
      } else if (
        participants?.includes(address?.toLowerCase() || "") &&
        winner.toLowerCase() !== address?.toLowerCase()
      ) {
        openLoserModal();
      }

      setState("lastWinner", winner.slice(0, 6) + "..." + winner.slice(-4));
      setState("participants", []);
      getContractBalance();
      getLotteryEndTime();
      toast.dismiss();
    });

    contract?.on("LotteryReset", (newDuration) => {
      toast.dismiss("pick-winner");
      toast(
        "Because of the lack of participants, the lottery end time has been reset.  If you joined the lottery, you don't need to join again. Just wait for the new lottery end time.",
        { icon: "🎉", id: "lottery-reset" }
      );
      setState("lotteryEndTime", newDuration.toString());
    });
  }, [contract]);

  if (!isConnected || !address) return <NotConnected />;

  return (
    <div>
      {participants && participants.length > 0 ? (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Participants List</h2>{" "}
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4">
            {participants.map((participant) => (
              <Card
                className={`bg-gradient-to-tr from-[#09090b] to-[#111113] ${
                  address.toLowerCase() === participant.toLowerCase()
                    ? "border-2 border-green-500"
                    : ""
                }`}
                isBlurred
                classNames={{
                  base: `bg-zinc-900 p-3`,
                  header: "flex items-center justify-center",
                }}
                key={participant}
              >
                <CardHeader>
                  <Blockies
                    className="rounded-full"
                    size={20}
                    seed={participant}
                    bgColor="#f0f0f0"
                  />
                </CardHeader>

                <CardBody>
                  <Popover showArrow>
                    <PopoverTrigger>
                      <p className="text-center cursor-pointer">
                        {participant.slice(0, 6) +
                          "..." +
                          participant.slice(-4)}
                      </p>
                    </PopoverTrigger>
                    <PopoverContent>{participant}</PopoverContent>
                  </Popover>
                </CardBody>
              </Card>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState onJoin={enterLottery} />
      )}

      <WinnerMessage
        onClose={closeWinnerModal}
        isOpen={isWinnerModalOpen}
        amountWon={amountWon}
      />
      <LoserMessage
        onClose={closeLoserModal}
        isOpen={isLoserModalOpen}
        onJoinNextLottery={enterLottery}
      />

      <OwnerModal
        isOpen={isOwnerModalOpen}
        onClose={closeOwnerModal}
        winner={{
          address: winner || "",
          amount: amountWon,
        }}
      />
    </div>
  );
}
