import Image from "next/image";

export default function Home() {
  return (
    // Safe View
    <div className="flex justify-center align-center p-16">
      {/* Stack  */}
      <div className="flex justify-center align-center flex-col">
        <h1 className="font-thin text-4xl text-center">
          Calculator
        </h1>
        <div className="w-100 h-100 bg-red-100">
          Box
        </div>
      </div>
    </div>
  );
}
