import { Button } from "@nextui-org/button";
import { FaRegSadCry } from "react-icons/fa";
import { useAppKit } from "@reown/appkit/react";

const NotConnected = () => {
  const { open } = useAppKit();
  return (
    <div className="max-w-sm mx-auto flex items-center flex-col gap-3">
      <FaRegSadCry className="text-6xl text-gray-500" />
      <h1 className="text-2xl font-bold">Not Connected</h1>
      <Button onPress={() => open()}>Connect Wallet</Button>
    </div>
  );
};

export default NotConnected;
