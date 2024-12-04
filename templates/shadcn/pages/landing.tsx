

import Cta from "../components/Cta";
import Faq from "../components/Faq";
import Feature from "../components/Feature";
import Hero from "../components/Hero";

import Pricing from "../components/Pricing";
import Section from "../components/Section";
import Testimonial from "../components/Testimonial";
import Usercase from "../components/Usecase";
import NameGenerator from "../components/NameGenerator";

export default function ShadcnLandingPage({ locale }) {
  return (
    <>

      <Hero />
      <NameGenerator locale={locale} />
      {/* <Usercase /> */}
      <Section />
      <Feature />
      {/* <Pricing /> */}
      <Testimonial />
      <Faq />
      <Cta />
    </>
  );
}
