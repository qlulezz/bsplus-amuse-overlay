import SongTitle from "../components/SongTitle";
import Visualizer from "../components/Visualizer";
import type { Palette } from "../hooks/useVibrant";
import { GammaFilter } from "../utils/filter";
import type { MapInfo } from "../utils/types";
import styles from "./Compact.module.css";

interface PlayerProps {
  cover: string;
  glow: boolean;
  blur: boolean;
  colors: Palette | null;
  info: MapInfo | null;
  isPlaying: boolean;
  visible: boolean;
  progressPct: number;
  formattedCurrent: string;
  formattedDuration: string;
}

export default function CompactPlayer(props: PlayerProps) {
  return (
    <div className={styles.widget}>
      <GammaFilter />
      <div className={styles.content}>
        <div className={styles.cover_container}>
          {props.glow && (
            <img className={styles.cover_glow} src={props.cover} alt="" />
          )}
          <img className={styles.cover} src={props.cover} alt="" />
        </div>
        <div
          className={styles.text}
          style={{ color: props.colors?.lightVibrant }}
        >
          <div
            className={styles.info}
            style={{
              background: props.colors?.darkMuted,
            }}
          >
            <SongTitle title={props.info?.name} />
            <p className={styles.artist}>{props.info?.artist}</p>
            {props.blur && (
              <div
                className={styles.cover_blur}
                style={{ backgroundImage: `url(${props.cover})` }}
              ></div>
            )}
          </div>
          <div
            className={styles.duration}
            style={{ background: props.colors?.darkMuted }}
          >
            <p>{props.formattedCurrent}</p>
            <div className={styles.vis_container}>
              <div className={styles.vis}>
                <Visualizer
                  isPlaying={props.isPlaying && props.visible}
                  color={props.colors?.vibrant}
                />
              </div>
            </div>
            <p>{props.formattedDuration}</p>
          </div>
        </div>
      </div>
      <div
        className={styles.bar_container}
        style={{ background: props.colors?.darkVibrant }}
      >
        <div
          className={styles.bar}
          style={{
            background: props.colors?.vibrant,
            width: props.progressPct + "%",
          }}
        ></div>
      </div>
    </div>
  );
}
