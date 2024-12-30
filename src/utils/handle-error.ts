import toast from "react-hot-toast";

export const handleContractErrors = (error: Error) => {
  console.log(error);

  if (error.message.includes("Contract not initialized")) {
    return toast.error("Contract not initialized");
  }
  if (error.message.includes("Owner cannot participate in the lottery")) {
    return toast.error("Owner cannot participate in the lottery");
  }
  if (error.message.includes("Lottery has ended")) {
    return toast.error("Lottery has ended");
  }
  if (error.message.includes("Not enough ETH to enter")) {
    return toast.error("Not enough ETH to enter");
  }
  if (error.message.includes("You can only participate once")) {
    return toast.error("You can only participate once");
  }
  if (error.message.includes("Only the owner can pick a winner")) {
    return toast.error("Only the owner can pick a winner");
  }
  if (error.message.includes("Lottery is still ongoing")) {
    return toast.error("Lottery is still ongoing");
  }
  if (
    error.message.includes(
      "No participants in the lottery. Lottery has been reset"
    )
  ) {
    return toast.error(
      "No participants in the lottery. Lottery has been reset"
    );
  }
  return toast.error("Error initializing contract. Please try again later");
};
