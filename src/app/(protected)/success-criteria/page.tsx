import { auth } from "@/lib/auth";

import { getAllCriteria } from "@/services/success-criteria.service";

import { Button } from "@/components/ui/button";

import { CreateSuccessCriteriaDialog } from "@/components/success-criteria/create-success-criteria-dialog";
import { SuccessCriteriaTable } from "@/components/success-criteria/success-criteria-table";

export default async function SuccessCriteriaPage() {
  const session = await auth();

  const result =
    await getAllCriteria(
      Number(session?.user.id),
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Success Criteria
          </h1>

          <p className="text-muted-foreground">
            Manage reusable success criteria
          </p>
        </div>

        <CreateSuccessCriteriaDialog>
          <Button>
            Create Criteria
          </Button>
        </CreateSuccessCriteriaDialog>
      </div>

      <SuccessCriteriaTable
        criteria={result.data ?? []}
      />
    </div>
  );
}