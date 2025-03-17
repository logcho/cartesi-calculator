"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { use, useEffect, useState } from "react";
import { Address, hexToString, stringToHex } from "viem";
import { useRollupsServer } from "@/hooks/rollups";
import exp from "constants";

export default function Home() {
  const [expression, setExpression] = useState("0"); // Start with "0" as the initial value
  const dappAddress: Address = "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"

  const { loading, success, error, write, notices} = useRollupsServer(dappAddress, stringToHex(expression));

  const [ result ] = notices;

  const handleExpression = (value: string) => {
    if (value === "C") {
      // Clear the calculation
      setExpression("0");
    } else {
      // Append the value to the current calculation
      setExpression(prev => (prev === "0" ? value : prev + value));
    }
  };

  const handleCalculate = () =>{
    write && write();
  }

  useEffect(() => {
    if(result) setExpression(hexToString(result));
  }, [result])

  return (
    // Safe View
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
      {/* Stack  */}
      <div className="flex justify-center items-center flex-col bg-gray-900 rounded-lg shadow-lg p-4 w-full sm:w-96">
        <div className="mb-6">
          <ConnectButton/>
        </div>
        <h1 className="font-light text-3xl text-white text-center mb-6">
          Calculator
        </h1>
        <div className="w-full bg-gray-700 rounded-md overflow-hidden">
          {/* Output  */}
          <div className="m-2 p-2 bg-gray-800 text-white rounded-md">
              <h1 className="font-light text-4xl text-right">{expression}</h1>
          </div>
          {/* Keyboard  */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Number buttons */}
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(num => (
              <Button key={num} className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleExpression(num)}>
                {num}
              </Button>
            ))}
            {/* Operator buttons */}
            {["+", "-", "*", "/"].map(op => (
              <Button key={op} className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleExpression(op)}>
                {op}
              </Button>
            ))}
            {/* Equals and Clear buttons */}
            <Button className="text-center py-4 text-2xl bg-green-600 text-white rounded-md hover:bg-green-500 col-span-2" onClick={() => handleCalculate()}>
              =
            </Button>
            <Button className="text-center py-4 text-2xl bg-red-600 text-white rounded-md hover:bg-red-500" onClick={() => handleExpression("C")}>
              C
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
function useWaitForTransaction(): { data: any; isLoading: any; } {
  throw new Error("Function not implemented.");
}

