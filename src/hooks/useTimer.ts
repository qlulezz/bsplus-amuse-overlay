/* eslint-disable react-hooks/purity */
import { useCallback, useEffect, useRef, useState } from "react";
import type { MapState, Packet } from "../utils/types";

function formatMs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function useTimer(mapState: MapState) {
  // rAF-driven display state
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  // Ref is mutated directly, never triggers re-renders on change
  const playbackRef = useRef({
    songTimeMs: 0, // song position at last reference point
    wallClockMs: Date.now(), // wall clock at last reference point
    timeMultiplier: 1,
  });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // rAF loop, called every frame
    const tick = () => {
      if (mapState.isPlaying && mapState.info) {
        const { songTimeMs, wallClockMs, timeMultiplier } = playbackRef.current;
        // Recomputes the current playback position based on how much real time has passed
        // since the last reference point (e.g. when the song started, resumed, or was seeked)
        const elapsed = (Date.now() - wallClockMs) * timeMultiplier;
        // Advance the song position by the elapsed time, capped at the total duration
        const computed = Math.min(songTimeMs + elapsed, mapState.info.duration);
        setCurrentTimeMs(computed);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [mapState.isPlaying, mapState.info]);

  // Handle important packets: mapInfo, pause, resume
  const handlePacket = useCallback((packet: Packet) => {
    if (packet._type === "handshake") return;
    const ev = packet._event;

    if (ev === "mapInfo") {
      const info = packet.mapInfoChanged;
      playbackRef.current = {
        songTimeMs: info.time,
        wallClockMs: Date.now(),
        timeMultiplier: info.timeMultiplier,
      };
      setCurrentTimeMs(info.time);
    }

    if (ev === "pause") {
      const currentSongTimeMs = packet.pauseTime * 1000;
      playbackRef.current = {
        ...playbackRef.current,
        songTimeMs: currentSongTimeMs,
        wallClockMs: Date.now(),
      };
      setCurrentTimeMs(currentSongTimeMs);
    }

    if (ev === "resume") {
      const currentSongTimeMs = packet.resumeTime * 1000;
      playbackRef.current = {
        ...playbackRef.current,
        songTimeMs: currentSongTimeMs,
        wallClockMs: Date.now(),
      };
      setCurrentTimeMs(currentSongTimeMs);
    }
  }, []);

  // Calculate the progress of the timer bar in %
  const duration = mapState.info?.duration ?? 0;
  const progressPct =
    duration > 0 ? Math.min(100, (currentTimeMs / duration) * 100) : 0;

  return {
    handlePacket,
    progressPct,
    formattedCurrent: formatMs(currentTimeMs),
    formattedDuration: formatMs(duration),
  };
}
