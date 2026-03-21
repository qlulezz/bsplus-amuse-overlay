import { useMemo, useState, useCallback, useEffect } from "react";
import styles from "./Visualizer.module.css";

interface VisualizerProps {
  isPlaying: boolean;
  color: string | undefined;
}

// Base multiplicator values that define the resting "mountain" shape.
const baseMultiplicators = [
  0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1,
  0.9, 0.8, 0.7,
];

export default function Visualizer({ isPlaying, color }: VisualizerProps) {
  // Live multiplicator values that drive the bar heights.
  const [multiplicators, setMultiplicators] = useState(baseMultiplicators);

  // Called every 700 ms to randomise bar heights.
  const animate = useCallback(() => {
    if (isPlaying) {
      // Each bar gets a random scale between 0 and 2× its base value.
      setMultiplicators(
        baseMultiplicators.map((base) => base * Math.random() * 2)
      );
    } else {
      // Collapse all bars to a minimal flat state when not playing.
      setMultiplicators(Array(baseMultiplicators.length).fill(0.3));
    }
  }, [isPlaying]);

  // Start the animation interval; clean it up when the component unmounts
  // or when the `animate` callback changes.
  useEffect(() => {
    const intervalId = setInterval(animate, 700);
    return () => clearInterval(intervalId);
  }, [animate]);

  return multiplicators.map((multiplicator, index) => (
    <VisualizerBar
      key={index}
      multiplicator={multiplicator}
      color={color ?? "gray"}
    />
  ));
}

interface VisualizerBarProps {
  multiplicator: number;
  color: string;
}

function VisualizerBar({ multiplicator, color }: VisualizerBarProps) {
  // Scale factor: multiply the raw multiplicator to get the visual height.
  // The original used 0.5 * multiplicator * 3.
  const scale = useMemo(() => 1.5 * multiplicator, [multiplicator]);

  // Shared inline style applied to all three segments.
  const sharedStyle = useMemo(
    () => ({
      backgroundColor: color ?? "gray",
      transition: "transform 1s, background-color 0.3s",
    }),
    [color]
  );

  return (
    <div className={styles.bar}>
      {/* Top cap: slides upward as scale grows */}
      <div
        className={styles.top_cap}
        style={{
          ...sharedStyle,
          transform: `translateY(calc(-${scale * 50}% + 3px))`,
        }}
      />

      {/* Middle body: stretches vertically */}
      <div
        className={styles.body}
        style={{
          ...sharedStyle,
          transform: `scale(1, ${scale})`,
        }}
      />

      {/* Bottom cap: slides downward as scale grows */}
      <div
        className={styles.bottom_cap}
        style={{
          ...sharedStyle,
          transform: `translateY(calc(${scale * 50}% - 3px))`,
        }}
      />
    </div>
  );
}
