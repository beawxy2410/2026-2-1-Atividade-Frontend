import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
      <h1 className="text-3xl font-bold text-black">
        Juliana Beatriz de Lima Araújo
      </h1>
      {}
      <Link 
        href="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Ir para Login
      </Link>
    </div>
  );
}




