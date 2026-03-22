import SongTitle from "./components/SongTitle";
import Visualizer from "./components/Visualizer";
import useBeatSaber from "./hooks/useBeatSaber";
import { useVibrant } from "./hooks/useVibrant";
import styles from "./Overlay.module.css";
import {
  useQueryState,
  parseAsString,
  parseAsFloat,
  parseAsBoolean,
} from "nuqs";

const overlayPositions: Record<string, string> = {
  "top-left": styles.top_left,
  "top-right": styles.top_right,
  "bottom-left": styles.bottom_left,
  "bottom-right": styles.bottom_right,
};

export default function Overlay() {
  // Get parameters from url
  const [position] = useQueryState("position", parseAsString);
  const [ip] = useQueryState("ip", parseAsString);
  const [scale] = useQueryState("scale", parseAsFloat.withDefault(1));
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
        className={`${styles.widget} ${visible ? styles.visible : styles.invisible}`}
        style={{ fontSize: `${scale * 100}%` }}
      >
        <div className={styles.content}>
          <div className={styles.cover_container}>
            <img className={styles.cover_glow} src={cover} alt="" />
            <img className={styles.cover} src={cover} alt="" />
          </div>
          <div className={styles.text} style={{ color: colors?.lightVibrant }}>
            <div
              className={styles.info}
              style={{
                background: colors?.darkMuted,
              }}
            >
              <SongTitle title={info?.name} />
              <p className={styles.artist}>{info?.artist}</p>
            </div>
            <div
              className={styles.duration}
              style={{ background: colors?.darkMuted }}
            >
              <p>{formattedCurrent}</p>
              <div className={styles.vis_container}>
                <div className={styles.vis}>
                  <Visualizer
                    isPlaying={isPlaying && visible}
                    color={colors?.vibrant}
                  />
                </div>
              </div>
              <p>{formattedDuration}</p>
            </div>
          </div>
        </div>
        <div
          className={styles.bar_container}
          style={{ background: colors?.darkVibrant }}
        >
          <div
            className={styles.bar}
            style={{
              background: colors?.vibrant,
              width: progressPct + "%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
