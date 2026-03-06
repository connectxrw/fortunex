"use client";

import { useQuery } from "convex-helpers/react/cache/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { BusinessContactInfo } from "@/features/web/customize/contact-info";
import CoverImage from "@/features/web/customize/cover";
import { BusinessDescription } from "@/features/web/customize/description";
import Logo from "@/features/web/customize/logo";
import { BusinessName } from "@/features/web/customize/name";
import {
  NoBusinessAccount,
  NoBusinessAccountInfo,
} from "../business/no-business";
import { BusinessSocialAccounts } from "./accounts";
import { BusinessCategory } from "./category";
import { BusinessCertificate } from "./certificate";

export default function Customize() {
  const business = useQuery(api.business.index.getMyBusiness);
  if (business === undefined) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton className="h-50 w-full" key={index} />
        ))}
      </>
    );
  }

  if (!business.success) {
    return <NoBusinessAccount />;
  }

  if (business.success && business.data === null) {
    return <NoBusinessAccountInfo />;
  }

  if (business.success && business.data !== null) {
    return (
      <>
        <CoverImage coverImageUrl={business.data.coverImageUrl || ""} />
        <Logo profileImageUrl={business.data.profileImageUrl || ""} />
        <BusinessName name={business.data.name} />
        <BusinessCategory category={business.data.category} />
        <BusinessCertificate
          certificateFileUrl={business.data.certificateFileUrl}
        />
        <BusinessDescription description={business.data.description} />
        <BusinessSocialAccounts
          socialMediaAccounts={business.data.socialMediaAccounts}
        />
        <BusinessContactInfo
          category={business.data.category}
          email={business.data.email}
          latitude={business.data.latitude}
          location={business.data.location}
          longitude={business.data.longitude}
          phone={business.data.phone}
        />
      </>
    );
  }
}
