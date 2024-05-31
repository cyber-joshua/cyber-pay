'use client'

import { useEffect, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';

const count = 48;
const borderColors = ['#0C9B00', '#07DC10', '#B7F7B0'];
const initialSize = 80;
const duration = 7;
const sizes = [initialSize, initialSize * 3, initialSize * 8];
const initialCircles = [...Array(count * 1000).keys()];

export default function HomeBgdDot() {
  return (
    <div
      className="flex items-center justify-center overflow-hidden w-screen h-96"
    >
      <LayoutGroup>
        <WaveDot />
      </LayoutGroup>
    </div>
  );
}

function WaveDot() {
  const [upper, setUpper] = useState(count);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setUpper((prev) => prev + count);
      },
      duration * 1000 - 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {initialCircles.map((index) => {
        if (index < upper - count || index >= upper + count) return null;
        const color = borderColors[index % 3];
        const outerIndex = index % count;
        return (
          <motion.div
            key={index}
            layout
            className="rounded-full absolute"
            style={{
              backgroundColor: color,
              zIndex: outerIndex < count / 2 ? -index : index,
            }}
            animate={{
              width: sizes,
              height: sizes,
            }}
            transition={{
              duration,
              times: [0, 0.1, 1],
              delay:
                outerIndex < count / 2
                  ? -0.5 * outerIndex
                  : 0.5 * (outerIndex - count / 2),
              ease: 'linear',
            }}
          />
        );
      })}
    </>
  );
}
