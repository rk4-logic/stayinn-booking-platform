import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-16 px-4 bg-blue-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Own a Property?</h2>
      <p className="text-blue-100 mb-8 text-lg">
        List your property on StayInn and reach thousands of travelers.
      </p>
      <Link href="/dashboard/become-owner">
        <Button variant="secondary" size="lg">
          List Your Property
        </Button>
      </Link>
    </section>
  );
}