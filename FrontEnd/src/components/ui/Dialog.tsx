import type { ReactNode } from "react";
import { motion } from "framer-motion";

type DialogProps = {
  children: ReactNode;
  onClose: () => void;
};

export function Dialog({ children, onClose }: DialogProps) {
  return (
    <motion.div
      className="dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
