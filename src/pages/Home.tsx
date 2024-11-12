import { LEGAL_WALLETS } from "@/lib/constants";
import { UserType } from "@/lib/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import companyImage from "../assets/proof_of_work.webp";

export function Home() {
  const { address } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      const userType = LEGAL_WALLETS.some((i) => i === address)
        ? UserType.LEGAL
        : UserType.INDIVIDUAL;
      navigate(`/${userType.toLocaleLowerCase()}`);
    } else {
      navigate(`/`);
    }
  }, [address]);

  return (
    <main className="max-w-[1100px] mx-auto mt-8">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "400px" }}>
          <img src={companyImage}></img>
        </div>
        <div style={{ width: 500, textAlign: "center" }} className="mt-8">
          Our platform uses blockchain to tackle the issue of fake work
          experience, allowing jobseekers to share real, verified job history
          with recruiters. Verified companies update these records on the
          blockchain, ensuring recruiters get trustworthy information about each
          candidate’s experience.
        </div>
      </div>
    </main>
  );
}
