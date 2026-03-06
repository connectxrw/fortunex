import Image from "next/image";
import coverImg from "@/public/auth-02.jpg";
export default function LoginCover() {
  return (
    <div className="group relative hidden h-screen w-full lg:flex lg:w-1/2">
      <div className="relative w-full overflow-hidden">
        <Image
          alt="Authentic, responsible adventure"
          className="h-full w-full object-cover"
          placeholder="blur"
          src={coverImg}
        />
        <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 via-black/50 to-transparent p-6">
          <div className="text-white">
            <h3 className="mb-3 font-bold text-[32px] leading-tight">
              Explore Faster
            </h3>
            <p className="mb-2 font-regular text-[16px]">
              Finding tourist sites became easy once I started using FortuneX.
              Now I can explore lakes, museums, and attractions in one place
              with honest reviews.
            </p>
            <p className="text-muted-foreground text-xs">
              Photo by James Nkusi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
