// WinnerMessage.tsx

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import React, { useEffect } from "react";

import { Button } from "@nextui-org/button";
import { FaCheckCircle } from "react-icons/fa";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountWon: string; // Kazanılan tutar
}

export const WinnerMessage: React.FC<WinnerModalProps> = ({
  isOpen,
  onClose,
  amountWon,
}) => {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <FaCheckCircle
            size={24}
            style={{ marginRight: "8px", color: "green" }}
          />
          <span>Congratulations You Won!</span>
        </ModalHeader>

        <ModalBody>
          <p>
            You've won <strong>{amountWon}</strong> ETH!
          </p>
          <p>We hope you enjoy your prize. Good luck next time as well!</p>
        </ModalBody>

        <ModalFooter>
          <Button color="success" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
