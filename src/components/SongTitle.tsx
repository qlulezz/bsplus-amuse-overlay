import styles from "./SongTitle.module.css";

interface SongTitleProps {
  title: string | undefined;
}

export default function SongTitle({ title }: SongTitleProps) {
  let duration = "0";
  if (title && title.length > 28) {
    duration = (title.length / 6).toFixed(2);
  }

  return (
    <p className={styles.song}>
      <span style={{ animationDuration: duration + "s" }}>{title}</span>
    </p>
  );
}
