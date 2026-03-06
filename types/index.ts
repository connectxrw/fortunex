import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

export type Tpost = {
  imgUrls: string[];
  title: string;
  slug: string;
  businessName: string;
  businessHandle: string;
  views: string;
  time: string;
  view: "card" | "short";
  type: "post" | "product";
  price?: string;
  productName?: string;
};

export type TBusiness = {
  name: string | undefined;
  handle: string | undefined;
  status: "verified" | "unverified" | "deleted" | undefined;
  category: string | undefined;
  followersCount: number | undefined;
  logo: string | null;
  latitude?: number | null;
  longitude?: number | null;
  openingHours?: { day: string; open?: string; close?: string; closed: boolean }[];
};

export type TChatPost = Doc<"post"> & { score?: number } & {
  coverImages: { key: string; url: string }[];
  postBusiness: TBusiness;
};

export type TBusinessCategory =
  | "restaurant"
  | "house"
  | "tourism"
  | "healthcare"
  | "shop"
  | "entertainment"
  | "education"
  | "technology"
  | "sports"
  | "agriculture"
  | "real estate"
  | "startup"
  | "jobs"
  | "media"
  | "other";

export type TCategory = {
  label: string;
  value: TBusinessCategory;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type TSubcategoryFilter = {
  label: string;
  value: string;
};
