import { useEffect } from "react";
import { useAccount } from "wagmi";

export function Home() {
  const { address } = useAccount();

  useEffect(() => {}, [address]);

  return (
    <main className="max-w-[1100px] mx-auto">
      <div>hello world</div>
    </main>
  );
}
