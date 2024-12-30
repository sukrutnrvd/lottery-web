// LoserMessage.tsx

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";

import { Button } from "@nextui-org/button";
import { FaTimesCircle } from "react-icons/fa";
import React from "react";

interface LoserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinNextLottery?: () => void;
}

export const LoserMessage: React.FC<LoserModalProps> = ({
  isOpen,
  onClose,
  onJoinNextLottery,
}) => {
  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <FaTimesCircle
            size={24}
            style={{ marginRight: "8px", color: "red" }}
          />
          <span>Sorry, You Lost</span>
        </ModalHeader>

        <ModalBody>
          <p>Better luck next time! Would you like to join the next lottery?</p>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onPress={onJoinNextLottery}>
            Join Next Lottery
          </Button>
          <Button color="default" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
