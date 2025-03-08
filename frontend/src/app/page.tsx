"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useWriteInputBoxAddInput } from "@/hooks/generated";
import { stringToHex } from "viem";
import { NOTICES_QUERY } from "@/hooks/gql";
import { useQuery } from "@apollo/client";

export default function Home() {
  const [calculation, setCalculation] = useState("0"); // Start with "0" as the initial value

  const handleClick = (value: string) => {
    if (value === "=") {
      try {
        // Evaluate the expression
        setCalculation(eval(calculation));
      } catch (error) {
        setCalculation("Error");
      }
    } else if (value === "C") {
      // Clear the calculation
      setCalculation("0");
    } else {
      // Append the value to the current calculation
      setCalculation(prev => (prev === "0" ? value : prev + value));
    }
  };

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
            <h1 className="font-light text-4xl text-right">
              {calculation}
            </h1>
          </div>
          {/* Keyboard  */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Number buttons */}
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("1")}>1</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("2")}>2</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("3")}>3</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("4")}>4</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("5")}>5</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("6")}>6</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("7")}>7</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("8")}>8</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("9")}>9</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("0")}>0</Button>
            {/* Operator buttons */}
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("+")}>+</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("-")}>-</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("*")}>*</Button>
            <Button className="text-center py-4 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-500" onClick={() => handleClick("/")}>/</Button>
            <Button className="text-center py-4 text-2xl bg-green-600 text-white rounded-md hover:bg-green-500 col-span-2" onClick={() => handleClick("=")}>=</Button>
            <Button className="text-center py-4 text-2xl bg-red-600 text-white rounded-md hover:bg-red-500" onClick={() => handleClick("C")}>C</Button> {/* Clear button */}
          </div>
        </div>
      </div>
    </div>
  );
}
