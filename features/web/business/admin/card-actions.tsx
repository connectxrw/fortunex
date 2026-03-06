import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import {
  BanIcon,
  CheckIcon,
  EllipsisIcon,
  EllipsisVerticalIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerButton,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import type { TBusinessData } from "./card";

export function BusinessCardActions({ business }: { business: TBusinessData }) {
  const verifyBusiness = useMutation(api.admin.business.verifyBusiness);
  const unverifyBusiness = useMutation(api.admin.business.unverifyBusiness);

  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyBusiness = async () => {
    try {
      setIsLoading(true);
      await verifyBusiness({ businessId: business.id });
      toast.success("Business verified successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to verify business");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to verify business",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnverifyBusiness = async () => {
    try {
      setIsLoading(true);
      await unverifyBusiness({ businessId: business.id });
      toast.success("Business unverified successfully");
    } catch (error) {
      console.error(error);
      if (error instanceof ConvexError) {
        toast.error(error.data.message || "Failed to unverify business");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to unverify business",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="hidden lg:flex">
          <Button size="icon-sm" variant="ghost">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="hidden w-52 flex-col lg:flex"
          side="right"
        >
          <DropdownMenuItem asChild>
            <Link href={`/b/${business.handle}`}>
              <ExternalLinkIcon />
              View
            </Link>
          </DropdownMenuItem>
          {business.status === "verified" ? (
            <DropdownMenuItem
              disabled={isLoading}
              onClick={handleUnverifyBusiness}
            >
              <BanIcon />
              <span>{isLoading ? "Unverifying..." : "Unverify"}</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={isLoading}
              onClick={handleVerifyBusiness}
            >
              <CheckIcon />
              <span>{isLoading ? "Verifying..." : "Verify"}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer>
        <DrawerTrigger asChild>
          <Button
            className="rounded-full lg:hidden"
            size="icon-sm"
            variant="ghost"
          >
            <EllipsisVerticalIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="rounded-t-md! lg:hidden">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Business Actions</DrawerTitle>
            <DrawerDescription>Business actions</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 border-b p-4">
            <Link
              className="flex items-center gap-2"
              href={`/b/${business.handle}`}
            >
              <ExternalLinkIcon className="size-4" />
              <span>View</span>
            </Link>

            {business.status === "verified" ? (
              <DrawerButton
                disabled={isLoading}
                icon={<BanIcon className="size-4" />}
                label="Unverify"
                onClick={handleUnverifyBusiness}
              />
            ) : (
              <DrawerButton
                disabled={isLoading}
                icon={<CheckIcon className="size-4" />}
                label="Verify"
                onClick={handleVerifyBusiness}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
