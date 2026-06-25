import { logoutAction } from "@/actions/auth.action";

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex w-full items-center"
      >
        Logout
      </button>
    </form>
  );
}