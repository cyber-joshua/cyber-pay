import { motion, useAnimation } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { useEffect } from "react";

const borderWidth = 4;
const count = 9;

const borderColors = ['#0C9B00', '#07DC10', '#B7F7B0'];
const waveShadow = (progress: number, initialZeros: number) => {
  const max = (count - initialZeros) * borderWidth;
  const currentStart = initialZeros - progress;
  return [...Array(count).keys()]
    .map((i) => {
      const width =
        i < currentStart ? 0 : (i - currentStart + 1) * borderWidth;
      return `0 0 0 ${Math.min(width, max)}px ${borderColors[i % 3]}`;
    })
    .join(', ');
};

const outWaveFrames = (progressCount: number, initialZeros: number) => {
  return [...Array(progressCount).keys()].map((v) =>
    waveShadow(v, initialZeros),
  );
};

const frames = outWaveFrames(7, 6);

export default function CyberButton({
  disabled = false,
  loading = false,
  title,
  onClick,
  className,
} : {
  disabled?: boolean,
  loading?: boolean,
  title: string,
  onClick: () => void,
  className?: string,
}) {

  const controls = useAnimation()

  useEffect(() => {
    if (loading && controls) {
      controls.start({
        boxShadow: frames
      });
    } else if (!loading && controls) {
      controls.stop();
    }
  }, [loading, controls])

  return (
    <motion.div
      className={twMerge(
        'flex items-center justify-center text-xl font-medium cursor-pointer rounded px-8 py-3' + (disabled && !loading ? ' opacity-60' : ''), 
        className
      )}
      initial={{
        boxShadow: frames[0]
      }}
      animate={controls}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      }}
      onClick={() => {
        if (loading || disabled) {
          return;
        }
        onClick();
      }}
    >
      {title}
    </motion.div>
  )
}
