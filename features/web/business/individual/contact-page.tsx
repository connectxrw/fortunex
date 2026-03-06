"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import ContactBusinessForm from "./contact-form";

export default function ContactFormPage({ handle }: { handle: string }) {
  const business = useQuery(api.business.index.getBusinessByHandle, { handle });
  if (business === undefined) {
    return null;
  }

  if (!(business && business)) {
    return notFound();
  }
  return (
    <ContactBusinessForm
      businessEmail={business.email}
      businessName={business.name}
    />
  );
}
