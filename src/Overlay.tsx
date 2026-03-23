import useBeatSaber from "./hooks/useBeatSaber";
import { useVibrant } from "./hooks/useVibrant";
import styles from "./Overlay.module.css";
import {
  useQueryState,
  parseAsString,
  parseAsFloat,
  parseAsBoolean,
} from "nuqs";
import CompactPlayer from "./players/Compact";

const overlayPositions: Record<string, string> = {
  "top-left": styles.top_left,
  "top-right": styles.top_right,
  "bottom-left": styles.bottom_left,
  "bottom-right": styles.bottom_right,
};

export default function Overlay() {
  // Get parameters from url
  const [position] = useQueryState("position", parseAsString);
  const [scale] = useQueryState("scale", parseAsFloat.withDefault(1));
  const [ip] = useQueryState("ip", parseAsString);
  const [glow] = useQueryState("glow", parseAsBoolean.withDefault(true));
  const [blur] = useQueryState("blur", parseAsBoolean.withDefault(true));
  const [debug] = useQueryState("debug", parseAsBoolean.withDefault(false));

  // Change styles of the overlay if position is given
  const positionStyle = position
    ? (overlayPositions[position.toLowerCase()] ?? "")
    : "";

  // Get info from the BeatSaberPlus connection
  const { state, progressPct, formattedCurrent, formattedDuration } =
    useBeatSaber(debug, ip ?? undefined);
  const { info, isPlaying, visible } = state;

  // Build the cover image and get prominent colors
  const cover = state.info?.coverRaw
    ? `data:image/png;base64,${state.info.coverRaw}`
    : "/CustomLevelsPack.jpg";
  const { colors } = useVibrant(cover);

  return (
    <div className={`${styles.overlay} ${positionStyle}`}>
      <div
        className={`${styles.widget} ${visible ? styles.visible : ""} `}
        style={{ fontSize: `${scale * 100}%` }}
      >
        <CompactPlayer
          cover={cover}
          glow={glow}
          blur={blur}
          colors={colors}
          info={info}
          isPlaying={isPlaying}
          visible={visible}
          progressPct={progressPct}
          formattedCurrent={formattedCurrent}
          formattedDuration={formattedDuration}
        />
      </div>
    </div>
  );
}
