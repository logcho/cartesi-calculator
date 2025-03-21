import { useEffect, useState } from "react";
import { Address, decodeEventLog, Hex, TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from 'wagmi'
import { inputBoxAbi, useSimulateInputBoxAddInput, useWriteInputBoxAddInput, } from "@/hooks/generated";
import { gql, useQuery } from '@apollo/client';

export const NOTICES_QUERY = gql`
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;


const useInputIndex = (receipt?: TransactionReceipt): bigint | undefined => {
    const [inputIndex, setInputIndex] = useState<bigint | undefined>();
    useEffect(() => {
        // runs when receipt changes
        if (receipt) {
            // search for InputAdded event in receipt logs
            const inputIndex = receipt.logs
                .map((log) => {
                    try {
                        // decode the event
                        const decodedLog = decodeEventLog({
                            abi: inputBoxAbi,
                            eventName: "InputAdded",
                            topics: log.topics,
                            data: log.data,
                        });
                        return decodedLog.args.inputIndex;
                    } catch (e: any) {
                        return undefined;
                    }
                })
                .filter((id): id is bigint => !!id)
                .at(0);

            // set inputIndex state variable
            setInputIndex(inputIndex);
        }
    }, [receipt]);
    return inputIndex;
};

export const useRollupsServer = (dapp: Address, input?: Hex) => {
    
    const { data: simulateData } = useSimulateInputBoxAddInput({
        args: [dapp, input!],
        
    });

    const { isPending: writePending, isSuccess: writeSuccess, error: writeError, writeContract, data: writeData } = useWriteInputBoxAddInput();

    const { data: reciept} = useWaitForTransactionReceipt({
        hash: writeData
    })

    const [notices, setNotices] = useState<Hex[]>([]);

    const write = async () => {
        if(simulateData) await writeContract(simulateData.request);
    };

    const inputIndex = useInputIndex(reciept);

    const { loading: queryLoading, error: queryError, data: queryData } = useQuery(NOTICES_QUERY, {
        skip: !inputIndex, // Ensures query runs only when inputIndex is defined
        pollInterval: 1000,
    });

    useEffect(() => {
        if (inputIndex && queryData) {
            // console.log(inputIndex.toString());
            const queriedNotices = queryData.notices.edges;
            // console.log(queriedNotices);
            const filteredNotices = queriedNotices
            .filter(({ node }: any) => {
                if(BigInt(node.input.index) === inputIndex) console.log("node.input.index:", node.input.index); // Log the value
                return BigInt(node.input.index) === inputIndex; // Ensure both are `bigint`
            })                
            .map(({ node }: any) => node.payload);
            // console.log(filteredNotices);
            setNotices(filteredNotices);
        }
    }, [inputIndex, queryData]);

    // Console log data
    // Set true if debugging
    if(false){
        if(simulateData){
            console.log("----------------");
            console.log("simulateData");
            console.log(simulateData);
            console.log("----------------");
        }
        if(writeData){
            console.log("----------------");
            console.log("writeData");
            console.log(writeData);
            console.log("----------------");
        }
        if(reciept){
            console.log("----------------");
            console.log("reciept");
            console.log(reciept);
            console.log("----------------");
        }
        if(inputIndex){
            console.log("----------------");
            console.log("inputIndex");
            console.log(inputIndex);
            console.log("----------------");
        }
    }
    
    return {
        loading: writePending || queryLoading,
        success: writeSuccess,
        error: writeError,
        write,
        notices,
    }
}
