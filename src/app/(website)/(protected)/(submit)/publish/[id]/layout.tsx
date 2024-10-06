import { DashboardSubmitHeader } from "@/components/dashboard/dashboard-submit-header";
import { SubmitStepper } from "@/components/submit/submit-stepper";

export default async function PublishLayout({ children }: { children: React.ReactNode }) {

  return (
    <div>
      <DashboardSubmitHeader
        title="3/3 Submit"
        subtitle="Review and publish product"
      >
        <SubmitStepper initialStep={3} />
      </DashboardSubmitHeader>

      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}
