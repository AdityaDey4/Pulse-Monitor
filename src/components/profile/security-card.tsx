import { ShieldCheck, Key } from "lucide-react";
import { CurrentUser } from "@/types/user.type";
import { Card, CardContent } from "@/components/ui/card";
import ChangePasswordForm from "./change-password-form";
import CreatePasswordForm from "./create-password-form";

type Props = { user: CurrentUser };

export default function SecurityCard({ user }: Props) {
  const isOAuth = !user.hasPassword;

  return (
    <Card className="overflow-hidden p-0">
      <div
        className={`flex items-center gap-3 px-5 py-4 w-full ${
          isOAuth
            ? "bg-emerald-600 dark:bg-emerald-700"
            : "bg-amber-500 dark:bg-amber-600"
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          {isOAuth
            ? <ShieldCheck className="w-4 h-4 text-white" />
            : <Key className="w-4 h-4 text-white" />
          }
        </div>
        <div className="space-y-0.5">
          <p className="text-white text-sm font-semibold leading-none">Security</p>
          <p className={`text-xs leading-none mt-1 ${isOAuth ? "text-emerald-100" : "text-amber-100"}`}>
            Manage your password and authentication.
          </p>
        </div>
      </div>
      <CardContent className="p-6">
        {user.hasPassword ? <ChangePasswordForm /> : <CreatePasswordForm provider={user.provider} />}
      </CardContent>
    </Card>
  );
}