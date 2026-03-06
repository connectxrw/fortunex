import { SiteHeader } from "@/features/web/_shared/site-header";
import { ContactInfo } from "@/features/web/contact/contact-content";
import { ContactForm } from "@/features/web/contact/contact-form";

export default function ContactPage() {
  return (
    <div>
      <div className="container sticky top-0 z-50 bg-background">
        <SiteHeader />
      </div>
      <section className="container w-full py-10">
        <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-lg border shadow-xs md:flex-row">
          <div className="border-b p-4 md:border-b-0">
            <ContactInfo />
          </div>
          <div className="flex w-full flex-1 bg-background md:border-l">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
