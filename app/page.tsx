import Image from "next/image";
import Providers from "./providers";
import HomePage from "@/components/home";

export default function Home() {
  return (
    <Providers>
      <HomePage />
    </Providers>
  );
}
