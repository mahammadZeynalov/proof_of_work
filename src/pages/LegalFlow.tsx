import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ABI, CONTRACT_ADDRESS, ERC20_ADDRESS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { CareerEvent, JobItem } from "@/lib/types";
import { rainbowkitConfig } from "@/config/rainbowkitConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export function LegalFlow() {
  const [searchValue, setSearchValue] = useState("");
  const [nfts, setNfts] = useState<JobItem[]>([]);
  const { writeContractAsync, isPending: isSubmitPending } = useWriteContract();
  const {
    data: nftsIds,
    isLoading: isNftsIdsLoading,
    refetch: refetchNftsIds,
  } = useReadContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [searchValue],
    query: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!(nftsIds as string[])?.length) return;
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

  const mintJob = async () => {
    try {
      const txHash = await writeContractAsync({
        abi: ABI,
        address: ERC20_ADDRESS,
        functionName: "mintNFT",
        args: [searchValue, jobText, jobCareerEvent],
      });

      await waitForTransactionReceipt(rainbowkitConfig, {
        confirmations: 1,
        hash: txHash,
      });
      toast({
        title: "Successfully added new job entry",
        description: "Refresh the page to see changes",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to add new job entry",
        variant: "destructive",
      });
      console.error(e);
    }
  };

  const handleSearch = () => {
    refetchNftsIds();
  };

  const [jobText, setJobText] = useState("");
  const [jobCareerEvent, setJobCareerEvent] = useState<CareerEvent>(
    CareerEvent.HIRED
  );

  return (
    <main className="max-w-[1100px] mx-auto">
      <div>
        <h2>Search candidate:</h2>
      </div>
      <div>
        <div></div>
        <div className="mt-6">
          <Input
            style={{ width: 500 }}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <Button onClick={handleSearch} disabled={isNftsIdsLoading}>
            Search
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
      <div>Add career information:</div>
      <div>
        <div>
          <label htmlFor="text">Job Event Description</label>
          <Input
            id="text"
            type="text"
            value={jobText}
            onChange={(event) => setJobText(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="careerEvent">Career Event</label>
          <Select
            onValueChange={(value: CareerEvent) => setJobCareerEvent(value)}
          >
            <SelectTrigger className="w-[90%] mx-auto">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={CareerEvent.HIRED}>Hired</SelectItem>
                <SelectItem value={CareerEvent.PROMOTED}>Promoted</SelectItem>
                <SelectItem value={CareerEvent.FIREWELL}>Farewell</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button type="button" disabled={isSubmitPending} onClick={mintJob}>
          Submit
        </Button>
      </div>
    </main>
  );
}
