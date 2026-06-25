import { getCurrentUserAction } from "@/actions/user.action";

import ProfileHeader from "@/components/profile/profile-header";
import ProfileCard from "@/components/profile/profile-card";
import SecurityCard from "@/components/profile/security-card";

export default async function ProfilePage() {
  const response = await getCurrentUserAction();

  if (response.status === "error" || !response.data) {
    return <div className="p-6">{response.message}</div>;
  }

  const user = response.data;

  return (
    <div className="space-y-6 p-6">
      <ProfileHeader />

      <ProfileCard user={user} />

      <SecurityCard user={user} />
    </div>
  );
}
