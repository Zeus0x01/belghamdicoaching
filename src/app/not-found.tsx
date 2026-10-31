import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-graphite flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-serif text-[10rem] text-copper/20 leading-none">404</p>
        <h1 className="heading-lg text-3xl mt-4">This page went off-program.</h1>
        <p className="text-wgray text-sm mt-3">The page you are looking for does not exist.</p>
        <Link href="/" className="btn-primary mt-10">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
