import Link from "next/link";

// Mock auth UI. Auth0 will replace this later.
export default function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-pink-100 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isLogin ? "Log in to check product links." : "Signing up is free. (Even for women.)"}
        </p>

        <form className="mt-6 space-y-4">
          {!isLogin && <Field label="Name" type="text" />}
          <Field label="Email" type="email" />
          <Field label="Password" type="password" />
          <button type="button" className="w-full rounded-full bg-pink-600 py-3 font-semibold text-white hover:bg-pink-700">
            {isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "No account? " : "Already have an account? "}
          <Link href={isLogin ? "/signup" : "/login"} className="font-medium text-pink-600 hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type }: { label: string; type: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        className="mt-1 w-full rounded-lg border border-pink-200 px-4 py-2.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
      />
    </label>
  );
}
