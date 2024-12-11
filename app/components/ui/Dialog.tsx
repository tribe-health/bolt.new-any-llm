import * as RadixDialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';

export const dialogVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      duration: 0.3,
    },
  },
};

export const dialogBackdropVariants = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
};

export function DialogTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <RadixDialog.Title className={`text-lg font-semibold text-bolt-elements-textPrimary ${className}`}>
      {children}
    </RadixDialog.Title>
  );
}

export function Dialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <RadixDialog.Root open={open}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay asChild onClick={onClose}>
          <motion.div
            className="bg-black/50 fixed inset-0 z-max backdrop-blur-sm"
            initial="closed"
            animate="open"
            exit="closed"
            variants={dialogBackdropVariants}
          />
        </RadixDialog.Overlay>
        <RadixDialog.Content asChild>
          <motion.div
            className="fixed top-[50%] left-[50%] z-max h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] border border-bolt-elements-borderColor rounded-lg shadow-lg focus:outline-none overflow-hidden bg-bolt-elements-background-depth-2"
            initial="closed"
            animate="open"
            exit="closed"
            variants={dialogVariants}
          >
            {children}
          </motion.div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
