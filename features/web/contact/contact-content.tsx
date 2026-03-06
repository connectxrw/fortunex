import {
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export function ContactInfo() {
  return (
    <div className="flex max-w-lg flex-col gap-5 p-2 md:p-5">
      <h3 className="mb-2 font-bold text-foreground text-xl leading-[1.2] tracking-tighter">
        Talk to our Sales team.
      </h3>
      <div className="flex flex-col gap-5">
        <p className="text-muted-foreground tracking-tight">
          <span className="font-bold text-foreground">
            <PhoneIcon className="mr-2 inline-block size-4" />
            Advertise with us:
          </span>
          Promote your business to thousands of users across Rwanda.
        </p>

        <p className="text-muted-foreground tracking-tight">
          <span className="font-bold text-foreground">
            <MailIcon className="mr-2 inline-block size-4" />
            Email us:
          </span>{" "}
          <a
            className="ml-1 hover:underline"
            href={`mailto:${siteConfig.links.email}`}
          >
            connectxrw@gmail.com
          </a>
        </p>
        <p className="text-muted-foreground tracking-tight">
          <span className="font-bold text-foreground">
            <MapPinIcon className="mr-2 inline-block size-4" />
            Our Location:
          </span>{" "}
          Kigali, Rwanda
        </p>
        <p className="text-muted-foreground tracking-tight">
          <span className="font-bold text-foreground">
            <MessageCircleIcon className="mr-2 inline-block size-4" />
            Whatsapp:
          </span>{" "}
          <a
            className="hover:underline"
            href={siteConfig.links.whatsapp}
            rel="noopener noreferrer"
            target="_blank"
          >
            +250 792 636 403
          </a>
        </p>
      </div>
    </div>
  );
}
