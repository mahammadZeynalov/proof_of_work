import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ABI, CONTRACT_ADDRESS, ERC20_ADDRESS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { JobItem } from "@/lib/types";
import { rainbowkitConfig } from "@/config/rainbowkitConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LegalFlow() {
  const [searchValue, setSearchValue] = useState("");
  const [nfts, setNfts] = useState<JobItem[]>([]);
  const {
    data: nftsIds,
    isLoading: isNftsIdsLoading,
    refetch: refetchNftsIds,
  } = useReadContract({
    abi: ABI,
    address: ERC20_ADDRESS,
    functionName: "balanceOf",
    args: [searchValue],
    query: {
      enabled: false,
    },
  });

  useEffect(() => {
    const tokenIds = nftsIds as string[];

    const fetchJobs = async () => {
      const result: JobItem[] = [];
      for (const tokenId of tokenIds) {
        const jobData = (await readContract(rainbowkitConfig, {
          abi: ABI,
          address: CONTRACT_ADDRESS,
          functionName: "getJobData",
          args: [tokenId],
        })) as JobItem;
        result.push(jobData);
      }
      setNfts(result);
    };
    fetchJobs();
  }, [nftsIds]);

  const handleSearch = () => {
    refetchNftsIds();
  };

  return (
    <main className="max-w-[1100px] mx-auto">
      <div>
        <h2>Search candidate:</h2>
      </div>
      <div>
        <div></div>
        <div className="mt-6">
          <Input
            style={{ width: 800 }}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Button onClick={handleSearch} disabled={isNftsIdsLoading}>
            With clicking this button you agree to provide your work experience
            data to HRs
          </Button>
        </div>
      </div>
      <div>
        {nfts.map((nft) => (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                {nft.careerEvent}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {nft.text}
              </CardDescription>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {nft.timestamp}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4"></CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
