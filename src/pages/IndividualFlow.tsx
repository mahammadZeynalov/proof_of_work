import Button from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { rainbowkitConfig } from "@/config/rainbowkitConfig";
import { ABI, CONTRACT_ADDRESS } from "@/lib/constants";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (address) {
      refetch();
    }
  }, [address]);

  const { writeContractAsync } = useWriteContract();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitLoading(true);
      const txHash = await writeContractAsync({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "register",
        args: [],
      });

      const res = await waitForTransactionReceipt(rainbowkitConfig, {
        confirmations: 1,
        hash: txHash,
      });
      console.log("res: ", res);

      toast({
        title: "Candidate successfully registered!",
        variant: "default",
      });

      refetch();
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to register",
        variant: "destructive",
      });
      console.error(e);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <main className="max-w-[1100px] mx-auto mt-8">
      {isAlreadyAgreedLoading ? (
        <div>Loading user status...</div>
      ) : isAlreadyAgreed ? (
        <div>You've already agreed to share your work history.</div>
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitLoading || isAlreadyAgreedLoading}
        >
          By clicking this button, you agree to provide your work experience
          data to HR professionals.
        </Button>
      )}
    </main>
  );
}
