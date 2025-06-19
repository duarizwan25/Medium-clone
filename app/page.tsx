import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
        <div className="container px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 leading-tight mb-6">Human stories & ideas</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A place to read, write, and deepen your understanding
            </p>
            <Link href="/explore">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg rounded-full">
                Start reading
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative illustration */}
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
          <div className="relative h-full w-full">
            <div className="absolute right-20 top-20 w-32 h-32 bg-green-400 rounded-full opacity-80"></div>
            <div className="absolute right-40 top-40 w-24 h-24 bg-green-500 rounded-full opacity-60"></div>
            <div className="absolute right-10 bottom-20 w-40 h-40 bg-green-300 rounded-full opacity-70"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
