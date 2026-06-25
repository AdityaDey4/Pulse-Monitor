import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { SuccessCriteriaActions } from "./success-criteria-actions";
import { SuccessCriteriaType } from "@/types/success-criteria.type";

interface Props {
  criteria: SuccessCriteriaType[];
}

export function SuccessCriteriaTable({
  criteria,
}: Props) {
  if (!criteria.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border bg-card">
        <p className="text-sm text-muted-foreground">
          No success criteria found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              Name
            </TableHead>

            <TableHead>
              Type
            </TableHead>

            <TableHead>
              Operator
            </TableHead>

            <TableHead>
              Expected Value
            </TableHead>

            <TableHead>
              Json Path
            </TableHead>

            <TableHead className="w-20 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {criteria.map(
            (item) => (
              <TableRow
                key={item.id}
              >
                <TableCell className="font-medium">
                  {item.name}
                </TableCell>

                <TableCell>
                  <Badge>
                    {item.type}
                  </Badge>
                </TableCell>

                <TableCell>
                  {item.operator}
                </TableCell>

                <TableCell>
                  {
                    item.expectedValue
                  }
                </TableCell>

                <TableCell>
                  {item.jsonPath ??
                    "-"}
                </TableCell>

                <TableCell className="text-right">
                  <SuccessCriteriaActions
                    criteria={
                      item
                    }
                  />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}