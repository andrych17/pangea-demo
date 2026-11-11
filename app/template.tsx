"use client";

import { motion } from "motion/react";
import { MOTION } from "@/lib/motion-styles";

// Every route change, in the site's motion style: rise and un-blur, slide sideways, long lift or small zoom.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={MOTION.page.from} animate={MOTION.page.to} transition={MOTION.page.transition}>
      {children}
    </motion.div>
  );
}
