import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ABI, CONTRACT_ADDRESS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { JobItem } from "@/lib/types";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/ui/loader";

export function LegalFlow() {
  const [searchValue, setSearchValue] = useState("");
  const [nfts, setNfts] = useState<JobItem[]>([]);
  const [isNftsLoading, setIsNftsLoading] = useState(false);
  const { writeContractAsync, isPending: isSubmitPending } = useWriteContract();
  const [isMintLoading, setIsMintLoading] = useState(false);
  const {
    data: nftsIds,
    isFetching: isNftsIdsLoading,
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
  console.log("searchValue: ", searchValue);
  console.log("nftIds: ", nftsIds);

  useEffect(() => {
    if (!Number(nftsIds)) return;
    const fetchJobs = async () => {
      const result: JobItem[] = [];
      setIsNftsLoading(true);
      try {
        for (let i = 0; i <= Number(nftsIds); i++) {
          console.log("i: ", i);
          const jobData = (await readContract(rainbowkitConfig, {
            abi: ABI,
            address: CONTRACT_ADDRESS,
            functionName: "JobData",
            args: [i],
          })) as JobItem;
          result.push(jobData);
        }
        setNfts(result);
      } catch (e) {
        console.log(e);
      } finally {
        setIsNftsLoading(false);
      }
    };
    fetchJobs();
  }, [nftsIds]);

  const mintJob = async () => {
    console.log(jobCareerEvent);
    console.log(jobText);
    try {
      setIsMintLoading(true);
      const txHash = await writeContractAsync({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "mintNFT",
        args: [candidateWalletAddress, jobText, parseInt(jobCareerEvent)],
      });
      console.log("txHash: ", txHash);

      await waitForTransactionReceipt(rainbowkitConfig, {
        confirmations: 1,
        hash: txHash,
      });
      toast({
        title: "Successfully added new job entry",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to add new job entry",
        variant: "destructive",
      });
      console.error(e);
    } finally {
      setIsMintLoading(false);
    }
  };

  const handleSearch = () => {
    refetchNftsIds();
  };

  const [jobText, setJobText] = useState("");
  const [jobCareerEvent, setJobCareerEvent] = useState<string>("0");
  const [candidateWalletAddress, setCandidateWalletAddress] =
    useState<string>("");

  return (
    <Tabs
      defaultValue="SEARCH"
      className="flex flex-col items-center mt-8"
      id="tabs"
    >
      <TabsList>
        <TabsTrigger value="SEARCH">Search</TabsTrigger>
        <TabsTrigger value="WORK">Add work experience</TabsTrigger>
      </TabsList>
      <TabsContent value="SEARCH" className="mt-8">
        <section>
          <div>
            <h2>Search candidate:</h2>
          </div>
          <div>
            <div
              className="mt-6"
              style={{
                width: 600,
                display: "flex",
                gap: 30,
                alignItems: "center",
              }}
            >
              <Input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <Button onClick={handleSearch} disabled={isNftsIdsLoading}>
                {isNftsIdsLoading || isNftsLoading ? <Loader /> : "Search"}
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
        </section>
      </TabsContent>
      <TabsContent value="WORK" className="mt-8">
        <div style={{ width: 600 }}>Add new career information:</div>
        <div className="mt-4">
          <div>
            <label htmlFor="text">Candidate wallet address:</label>
            <Input
              id="text"
              type="text"
              value={candidateWalletAddress}
              className="mt-2"
              onChange={(event) =>
                setCandidateWalletAddress(event.target.value)
              }
            />
          </div>
          <div className="mt-4">
            <label htmlFor="text">Description:</label>
            <Input
              id="text"
              type="text"
              value={jobText}
              className="mt-2"
              onChange={(event) => setJobText(event.target.value)}
            />
          </div>

          <div className="mt-4">
            <label htmlFor="careerEvent">Career Event:</label>
            <div className="mt-2 select-override">
              <Select
                onValueChange={(value: string) => setJobCareerEvent(value)}
              >
                <SelectTrigger className="w-[90%] mx-auto">
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={"0"}>Hired</SelectItem>
                    <SelectItem value={"1"}>Promoted</SelectItem>
                    <SelectItem value={"2"}>Farewell</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            disabled={isSubmitPending}
            onClick={mintJob}
            className="mt-4"
          >
            {isSubmitPending || isMintLoading ? <Loader /> : "Submit"}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
