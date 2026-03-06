"use client";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";

export default function AboutContent({ handle }: { handle: string }) {
  const business = useQuery(api.business.index.getBusinessByHandle, { handle });
  if (business === undefined) {
    return null;
  }

  if (!business) {
    return notFound();
  }
  return (
    <section className="space-y-6">
      {business.description && (
        <div className="flex flex-col gap-4">
          <h3 className="font-medium text-xl tracking-tight">
            Our Description
          </h3>
          <p className="text-muted-foreground">{business.description}</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-xl tracking-tight">
          Our Contact Information
        </h3>
        {business.email && (
          <p className="text-muted-foreground">Email: {business.email}</p>
        )}
        {business.phone && (
          <p className="text-muted-foreground">Phone: {business.phone}</p>
        )}
        {business.website && (
          <p className="text-muted-foreground">Website: {business.website}</p>
        )}
        <div>
          {business.socialLinks && (
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-xl tracking-tight">
                Our Social Links
              </h3>
              {business.socialLinks.map((link, index) => (
                <a
                  className="text-muted-foreground hover:underline"
                  href={link}
                  key={index}
                  target="_blank"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {business.location && (
        <div className="flex flex-col gap-6">
          <h3 className="font-medium text-xl tracking-tight">Our Location</h3>

          <div className="relative mx-auto w-full overflow-hidden rounded-lg">
            <iframe
              allowFullScreen
              className="aspect-video h-full w-full rounded-sm lg:min-h-125"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={business.location}
              title={`${business.name} Location`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
