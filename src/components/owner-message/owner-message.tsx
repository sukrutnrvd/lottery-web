import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

import { Button } from "@nextui-org/button";
import { FaUserShield } from "react-icons/fa";
// OwnerModal.tsx
import React from "react";

interface WinnerInfo {
  address: string;
  amount: string; // Kazanılan miktar
}

interface OwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: WinnerInfo | null; // Null veya bir WinnerInfo
}

export const OwnerModal: React.FC<OwnerModalProps> = ({
  isOpen,
  onClose,
  winner,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <FaUserShield
            size={24}
            style={{ marginRight: "8px", color: "#f5a623" }}
          />
          <span>Owner Panel</span>
        </ModalHeader>

        <ModalBody>
          <p>This information is only visible to the contract owner.</p>
          {winner === null || !winner.address ? (
            <p>No winner yet.</p>
          ) : (
            <div>
              <strong>Wallet: </strong>
              {winner.address}
              <br />
              <strong>Amount Won: </strong>
              {winner.amount} ETH
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="default" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
