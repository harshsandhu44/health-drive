"use client";

import { PropsWithChildren } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export const AnimateProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const variants = {
    initial: {
      opacity: 0,
    },

    enter: {
      opacity: 1,

      transition: {
        duration: 0.3,
      },
    },

    exit: {
      opacity: 0,
    },
  };
  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};
