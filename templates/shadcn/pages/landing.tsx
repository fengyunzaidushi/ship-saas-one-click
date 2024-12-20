'use client';

import { motion } from "framer-motion";
import Cta from "../components/Cta";
import Faq from "../components/Faq";
import Feature from "../components/Feature";
import Hero from "../components/Hero";
import Section from "../components/Section";
import Testimonial from "../components/Testimonial";
import dynamic from 'next/dynamic';

const NameGenerator = dynamic(() => import('../components/NameGenerator'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const PricingOnetime = dynamic(() => import('../../../components/PricingOnetime'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const scrollVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeInOut"
    }
  }
};

export default function ShadcnLandingPage({ locale }) {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <Hero />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <NameGenerator locale={locale} />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <Section />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <Feature />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <PricingOnetime />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <Testimonial />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <Faq />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollVariants}
      >
        <Cta />
      </motion.div>
    </>
  );
}
