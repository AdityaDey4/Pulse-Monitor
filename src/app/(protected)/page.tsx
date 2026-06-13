import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">
            Pulse Monitor
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {session?.user?.name ?? "User"} 👋
            </span>

            <form
              action={async () => {
                "use server";

                const { signOut } = await import(
                  "@/lib/auth"
                );

                await signOut({
                  redirectTo: "/login",
                });
              }}
            >
              <button className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-gray-600">
            Logged in as{" "}
            <span className="font-medium">
              {session?.user?.email}
            </span>
          </p>
        </div>

        {/* User Details */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <h3 className="mb-4 text-xl font-semibold">
            Session Details
          </h3>

          <div className="space-y-2">
            <p>
              <strong>ID:</strong>{" "}
              {session?.user?.id}
            </p>

            <p>
              <strong>Name:</strong>{" "}
              {session?.user?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {session?.user?.email}
            </p>
          </div>
        </div>

        {/* Existing Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Monitors
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              0
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Active Monitors
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              0
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Uptime
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              100%
            </h3>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Status
            </p>
            <h3 className="mt-2 text-3xl font-bold text-green-600">
              Healthy
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
}