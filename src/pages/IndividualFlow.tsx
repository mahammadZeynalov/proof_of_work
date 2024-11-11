import Button from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { rainbowkitConfig } from "@/config/rainbowkitConfig";
import { ABI, CONTRACT_ADDRESS } from "@/lib/constants";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";

export function IndividualFlow() {
  const { address } = useAccount();

  const {
    data: isAlreadyAgreed,
    isLoading: isAlreadyAgreedLoading,
    refetch,
  } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "checkRegistration",
    args: [address as `0x${string}`],
    query: {
      enabled: false,
    },
  });

  const { writeContractAsync, isPending: isSubmitPending } = useWriteContract();

  const handleSubmit = async () => {
    try {
      const txHash = await writeContractAsync({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "register",
        args: [],
      });

      await waitForTransactionReceipt(rainbowkitConfig, {
        confirmations: 1,
        hash: txHash,
      });
      toast({
        title: "Successfully registered",
        description: "",
      });

      refetch();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to register",
        variant: "destructive",
      });
      console.error(e);
    }
  };

  return (
    <main className="max-w-[1100px] mx-auto">
      {isAlreadyAgreedLoading ? (
        <div>Loading verification status...</div>
      ) : isAlreadyAgreed ? (
        <div>You have been already agreed to provide work history</div>
      ) : (
        <Button onClick={handleSubmit} disabled={isSubmitPending}>
          With clicking this button you agree to provide your work experience
          data to HRs
        </Button>
      )}
    </main>
  );
}
