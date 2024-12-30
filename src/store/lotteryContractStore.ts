import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  formatUnits,
} from "ethers";

import { create } from "zustand";
import { handleContractErrors } from "@/utils/handle-error";
import toast from "react-hot-toast";

interface ILotteryContractState {
  address: string;
  abi: any[];
  contract: Contract | null;
  contractBalance: string;
  entranceFee: string;
  participants: string[] | null;
  isLoading: boolean;
  owner: string | null;
  lotteryEndTime: string | null;
  lastWinner: string | null;
}

interface ILotteryContractStore {
  state: ILotteryContractState;
  setState<T extends keyof ILotteryContractState>(
    key: T,
    value: ILotteryContractState[T]
  ): void;
  initContract(walletProvider: Eip1193Provider): void;
  enterLottery(): void;
  pickWinner(): void;
  addNewParticipant(participant: string): void;
  getContractBalance(): void;
  getLotteryEndTime(): void;
}

const initialState: ILotteryContractState = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
  // not sure if this should be stored in the store
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_priceFeedAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_durationInMinutes",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "participant",
          type: "address",
        },
      ],
      name: "Entered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "newDuration",
          type: "uint256",
        },
      ],
      name: "LotteryReset",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "winner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amountWon",
          type: "uint256",
        },
      ],
      name: "Winner",
      type: "event",
    },
    {
      stateMutability: "payable",
      type: "fallback",
    },
    {
      inputs: [],
      name: "enterLottery",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getContractBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getEntranceFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getLastWinner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getParticipants",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "usdAmount",
          type: "uint256",
        },
      ],
      name: "getWeiFromUsd",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastWinner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lotteryEndTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "participants",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "nextLotteryDurationInMinutes",
          type: "uint256",
        },
      ],
      name: "pickWinner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "priceFeedAdress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "usdEntryFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ],
  owner: null,
  lotteryEndTime: null,
  isLoading: true,
  contract: null,
  contractBalance: "0",
  entranceFee: "0",
  participants: null,
  lastWinner: null,
};

export const useLotteryContractStore = create<ILotteryContractStore>(
  (set, get) => ({
    state: initialState,
    setState: (key, value) =>
      set((state) => ({
        state: {
          ...state.state,
          [key]: value,
        },
      })),
    initContract: async (walletProvider: Eip1193Provider) => {
      const { address, abi } = get().state;

      try {
        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();

        const contract = new Contract(address, abi, signer);

        const entranceFee = await contract.getEntranceFee();
        const contractBalance = await contract.getContractBalance();
        const participants = await contract.getParticipants();

        const lotteryEndTime = await contract.lotteryEndTime();

        const owner = await contract.owner();

        const lastWinner = await contract.getLastWinner();

        set((state) => ({
          state: {
            ...state.state,
            contract,
            entranceFee: formatUnits(entranceFee, 18),
            contractBalance: formatUnits(contractBalance, 18),
            participants,
            owner,
            lotteryEndTime: lotteryEndTime.toString(),
            isLoading: false,
            lastWinner: lastWinner.slice(0, 6) + "..." + lastWinner.slice(-4),
          },
        }));
      } catch (error: any) {
        handleContractErrors(error);
        set((state) => ({
          state: {
            ...state.state,
            isLoading: false,
          },
        }));
      }
    },
    enterLottery: async () => {
      const {
        state: { contract },
      } = get();

      try {
        if (!contract) {
          throw new Error("Contract not initialized");
        }
        await contract.enterLottery({
          value: await contract.getEntranceFee(),
        }),
          toast.loading("Entering lottery...");
        set((state) => ({
          state: {
            ...state.state,
          },
        }));
      } catch (error: any) {
        handleContractErrors(error);
      }
    },
    pickWinner: async () => {
      const { contract } = get().state;

      try {
        if (!contract) {
          throw new Error("Contract not initialized");
        }
        await contract.pickWinner(2);
        toast.loading("Picking winner...", {
          id: "pick-winner",
        });
      } catch (error: any) {
        handleContractErrors(error);
      }
    },
    addNewParticipant: (participant) =>
      set((state) => {
        if (!state.state.participants) {
          return {
            state: {
              ...state.state,
              participants: [participant],
            },
          };
        }

        if (state.state.participants.includes(participant)) {
          return {
            state: {
              ...state.state,
            },
          };
        }

        return {
          state: {
            ...state.state,
            participants: [...state.state.participants, participant],
          },
        };
      }),

    getContractBalance: async () => {
      const {
        state: { contract },
      } = get();

      try {
        if (!contract) {
          throw new Error("Contract not initialized");
        }

        const contractBalance = await contract.getContractBalance();

        set((state) => ({
          state: {
            ...state.state,
            contractBalance: formatUnits(contractBalance, 18),
          },
        }));
      } catch (error: any) {
        handleContractErrors(error);
      }
    },
    getLotteryEndTime: async () => {
      const {
        state: { contract },
      } = get();

      try {
        if (!contract) {
          throw new Error("Contract not initialized");
        }

        const lotteryEndTime = await contract.lotteryEndTime();

        set((state) => ({
          state: {
            ...state.state,
            lotteryEndTime: lotteryEndTime.toString(),
          },
        }));
      } catch (error: any) {
        handleContractErrors(error);
      }
    },
  })
);
