import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { SubmitStepper } from "@/components/submit/submit-stepper";

export default async function SubmitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardSubmitHeader
        title="Submit"
        subtitle="1/3 Enter product details"
      >
        <SubmitStepper initialStep={1} />
      </DashboardSubmitHeader>

      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}
