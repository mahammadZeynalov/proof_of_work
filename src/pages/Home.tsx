import { LEGAL_WALLETS } from "@/lib/constants";
import { UserType } from "@/lib/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export function Home() {
  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      const userType = LEGAL_WALLETS.some((i) => i === address)
        ? UserType.LEGAL
        : UserType.INDIVIDUAL;
      navigate(`/${userType.toLocaleLowerCase()}`);
    }
  }, [address]);

  return (
    <main className="max-w-[1100px] mx-auto">
      <div>Job history platform. Connect Wallet pls</div>
    </main>
  );
}
