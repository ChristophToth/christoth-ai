import { Hero } from "@/components/Hero";
import { AdoptionThesis } from "@/components/AdoptionThesis";
import { OperatingModel } from "@/components/OperatingModel";
import { Services } from "@/components/Services";
import { ValueProps } from "@/components/ValueProps";
import { Projects } from "@/components/Projects";
import { Expertise } from "@/components/Expertise";
import { BrandTimeline } from "@/components/BrandTimeline";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AdoptionThesis />
      <OperatingModel />
      <Services />
      <ValueProps />
      <Projects />
      <Expertise />
      <BrandTimeline />
      <FAQ />
      <Footer />
    </>
  );
}
