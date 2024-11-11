import { useEffect } from "react";
import { useAccount } from "wagmi";

export function LegalFlow() {
  const { address } = useAccount();

  useEffect(() => {}, [address]);

  return (
    <main className="max-w-[1100px] mx-auto">
      <div>legal</div>
    </main>
  );
}
