import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="mb-4">
            <span className="font-bold text-xl text-white">StayInn</span>
          </div>
          <p className="text-sm text-gray-500">
            Find and book your perfect stay worldwide.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/properties" className="hover:text-white">Properties</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">For Owners</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/owner/properties" className="hover:text-white">List Property</Link></li>
            <li><Link href="/owner/bookings" className="hover:text-white">Manage Bookings</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        <p>© {new Date().getFullYear()} StayInn. Built with Next.js, MongoDB and Clerk.</p>
      </div>
    </footer>
  );
}