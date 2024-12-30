// EmptyState.tsx

import { Button } from "@nextui-org/button";
import { FaUserPlus } from "react-icons/fa";
import React from "react";

interface EmptyStateProps {
  onJoin: () => void; // "Join Now" butonuna tıklandığında çalışacak fonksiyon
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onJoin }) => {
  return (
    <div className="text-center p-8  rounded-lg mt-4">
      <FaUserPlus className="text-gray-400 text-6xl mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Participants Yet</h2>
      <p className="text-gray-500 mb-6">Be the first to join the lottery!</p>
      <Button color="primary" onPress={onJoin}>
        Join Now
      </Button>
    </div>
  );
};
