import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { SubmitStepper } from "@/components/submit/submit-stepper";

export default async function PlanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardSubmitHeader
        title="Submit"
        subtitle="2/3 Choose pricing plan"
      >
        <SubmitStepper initialStep={2} />
      </DashboardSubmitHeader>

      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}
