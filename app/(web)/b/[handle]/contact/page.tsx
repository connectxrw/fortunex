import { Suspense } from "react";
import ContactFormPage from "@/features/web/business/individual/contact-page";

export default function ContactPage(props: PageProps<"/b/[handle]">) {
  return (
    <div>
      <Suspense>
        <SuspendedContactPage {...props} />
      </Suspense>
    </div>
  );
}

async function SuspendedContactPage(props: PageProps<"/b/[handle]">) {
  const { handle } = await props.params;
  return (
    <div className="@container/main mx-auto max-w-3xl">
      <ContactFormPage handle={handle} />
    </div>
  );
}
