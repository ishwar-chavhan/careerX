import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center text-white bg-[#000814]">
      <h1 className="text-7xl font-bold text-purple-500">404</h1>
      <p className="mt-4 text-xl font-semibold">Page not found</p>
      <p className="mt-2 text-sm text-slate-400">
        The page you are looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-medium transition"
      >
        Go to Home
      </Link>
    </main>
  );
}