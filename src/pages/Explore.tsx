import { motion } from 'framer-motion';
import ExploreByGenre from '@/components/ExploreByGenre';
import Footer from '@/components/Footer';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 },
};

export default function Explore() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-xf-bg pt-24 lg:pt-28 pb-10"
    >
      <div className="px-4 sm:px-8 lg:px-12 mb-1">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white mb-1">Explore</h1>
        <p className="text-xf-muted text-sm sm:text-base">
          Jump straight into a category, or browse everything from the top nav.
        </p>
      </div>

      <div className="mt-6">
        <ExploreByGenre title="" />
      </div>

      <Footer />
    </motion.div>
  );
}
