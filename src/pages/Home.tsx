import { ABI, ERC20_ADDRESS } from "@/lib/constants";
import { UserType } from "@/lib/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";

export function Home() {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { data, isLoading, refetch, isSuccess } = useReadContract({
    abi: ABI,
    address: ERC20_ADDRESS,
    functionName: "checkUserType",
    args: [ERC20_ADDRESS],
    query: {
      enabled: false,
    },
  });

  useEffect(() => {
    refetch();
  }, [address]);

  useEffect(() => {
    if (data && isSuccess) {
      // get user type from data response of smart contract
      const userType = UserType.INDIVIDUAL;
      navigate(`/${userType}`);
    }
  }, [data, isSuccess]);

  return (
    <main className="max-w-[1100px] mx-auto">
      {!address ? <div>Login first</div> : isLoading && <div>Loading...</div>}
    </main>
  );
}
