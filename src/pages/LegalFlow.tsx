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
import { useForm, Controller } from "react-hook-form";
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
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<JobItem>();
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
  const { writeContractAsync, isPending: isSubmitPending } = useWriteContract();

  const mintJob = async () => {
    const formData = getValues();
    try {
      const txHash = await writeContractAsync({
        abi: ABI,
        address: ERC20_ADDRESS,
        functionName: "submitToShareWorkExperience",
        args: [formData.careerEvent, formData.text],
      });

      await waitForTransactionReceipt(rainbowkitConfig, {
        confirmations: 1,
        hash: txHash,
      });
      toast({
        title: "Successfully minted tRSK tokens",
        description: "Refresh the page to see changes",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to mint tRSK tokens",
        variant: "destructive",
      });
      console.error(e);
    }
  };

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
      <div>Add career information:</div>
      <div>
        <form onSubmit={handleSubmit(mintJob)}>
          <div>
            <label htmlFor="text">Job Event Description</label>
            <Input
              id="text"
              type="text"
              {...control.register("text", {
                required: "Description is required",
              })}
            />
            {errors.text && <span>{errors.text.message}</span>}
          </div>

          <div>
            <label htmlFor="careerEvent">Career Event</label>
            <Controller
              name="careerEvent"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger className="w-[90%] mx-auto">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={CareerEvent.HIRED}>Hired</SelectItem>
                      <SelectItem value={CareerEvent.PROMOTED}>
                        Promoted
                      </SelectItem>
                      <SelectItem value={CareerEvent.FIREWELL}>
                        Farewell
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.careerEvent && <span>{errors.careerEvent.message}</span>}
          </div>

          <Button type="submit" disabled={isSubmitPending}>
            Submit
          </Button>
        </form>
      </div>
    </main>
  );
}
