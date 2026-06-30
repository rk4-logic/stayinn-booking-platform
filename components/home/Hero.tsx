import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your Perfect Stay
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Discover hotels, villas and apartments worldwide.
          Book instantly, travel confidently.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <Input
            placeholder="Where do you want to go?"
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-gray-700"
          />
          <Link href="/properties">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}