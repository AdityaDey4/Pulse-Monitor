import Image from "next/image";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/404.gif"
        alt="Page Not Found"
        width={700}
        height={350}
        priority
        unoptimized
        className="max-w-full h-auto"
      />

      <div className="mt-6 flex flex-col items-center">
        <SearchX className="h-12 w-12 text-red-500 mb-4" />

        <h1 className="text-3xl font-bold text-white">
          Page Not Found
        </h1>

        <p className="mt-3 max-w-md text-sm text-gray-400">
          The page you're looking for doesn't exist, has been moved,
          or the URL may be incorrect.
        </p>
      </div>
    </div>
  );
}