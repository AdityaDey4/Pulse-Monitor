import { User } from "lucide-react";
import { CurrentUser } from "@/types/user.type";
import { Card, CardContent } from "@/components/ui/card";
import ProfileForm from "./profile-form";

type Props = { user: CurrentUser };

export default function ProfileCard({ user }: Props) {
  return (
    <Card className="overflow-hidden p-0">
      {/* Custom header — no CardHeader, avoids default padding gaps */}
      <div className="flex items-center gap-3 px-5 py-4 bg-indigo-600 dark:bg-indigo-700 w-full">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="space-y-0.5">
          <p className="text-white text-sm font-semibold leading-none">Profile information</p>
          <p className="text-indigo-100 text-xs leading-none mt-1">Update your personal details.</p>
        </div>
      </div>
      <CardContent className="p-6">
        <ProfileForm user={user} />
      </CardContent>
    </Card>
  );
}