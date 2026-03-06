import Image from "next/image";
import { siteConfig } from "@/config/site";
import logo from "@/public/logo-black.png";

export function CustomLoader() {
  return (
    <div className="flex animate-pulse items-center gap-2">
      <Image alt="icon" className="w-5 dark:invert" src={logo} />
      <span className="font-semibold font-serif text-lg lg:text-xl">
        {siteConfig.name}
      </span>
    </div>
  );
}
