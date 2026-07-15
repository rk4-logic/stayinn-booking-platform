import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";
import FeaturedProperties from "@/components/home/FeaturedProperties";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProperties />
      <Features />
      <CTA />
    </main>
  );
}