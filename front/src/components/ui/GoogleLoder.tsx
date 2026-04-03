import { motion } from "motion/react";

export const GoogleLoader = ({ size = 48 }: { size?: number }) => {
  const strokeWidth = size / 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox={`0 0 ${size} ${size}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-full h-full"
      >
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{
            strokeDasharray: `1, ${circumference}`,
            strokeDashoffset: 0,
            stroke: colors[0],
          }}
          animate={{
            strokeDasharray: [
              `1, ${circumference}`,
              `${circumference * 0.75}, ${circumference}`,
              `${circumference * 0.75}, ${circumference}`,
            ],
            strokeDashoffset: [0, -circumference * 0.25, -circumference],
            stroke: colors,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            stroke: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      </motion.svg>
    </div>
  );
};
