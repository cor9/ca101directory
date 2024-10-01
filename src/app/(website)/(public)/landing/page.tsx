import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";
import { NewsletterForm } from "@/components/emails/newsletter-form";
import React from "react";

export default function IndexPage() {
  return (
    <div>
      <HeroLanding />

      {/* <div className="w-full flex flex-col items-center justify-center gap-8">
        <NewsletterForm />
      </div> */}

      <PreviewLanding />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      <InfoLanding data={infos[1]} />
      <Features />
      <Testimonials />
    </div>
  );
}
