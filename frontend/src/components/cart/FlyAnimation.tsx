'use client';

import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

type Props = {
  imageUrl: string;
  from: DOMRect;
  to: DOMRect;
  onComplete: () => void;
};

export default function FlyToCart({ imageUrl, from, to, onComplete }: Props) {
  if (typeof window === 'undefined') return null; // SSR-safe check

  return createPortal(
    <motion.img
      src={imageUrl}
      initial={{
        position: 'fixed',
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        zIndex: 9999,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        left: to.left,
        top: to.top,
        width: to.width * 0.3,
        height: to.height * 0.3,
        scale: 0.3,
        opacity: 0,
      }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
      style={{ pointerEvents: 'none' }}
    />,
    document.body
  );
}
