import OnBoardingSiteFooter from "@/features/onboarding/site-footer";
import OnboardingSiteHeader from "@/features/onboarding/site-header";

export default function AppLayout(props: LayoutProps<"/">) {
  return (
    <div className="relative z-10 flex h-full min-h-svh flex-col bg-background dark:bg-black">
      <OnboardingSiteHeader />
      <main className="container-wrapper flex flex-1 flex-col bg-muted/50">
        <div className="flex h-full min-h-[calc(100vh-12rem)] w-full items-center justify-center">
          <div className="mx-auto my-10 w-full max-w-137.5 rounded-md bg-background shadow dark:bg-black">
            <div className="px-6 pt-16 pb-12 md:px-10 lg:px-20">
              {props.children}
            </div>
          </div>
        </div>
      </main>
      <OnBoardingSiteFooter />
    </div>
  );
}
