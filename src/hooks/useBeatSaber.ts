import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import type { Handshake, Packet, MapInfo, Score } from "../utils/types";

// Connects to the BeatSaberPlus WebSocket for Map Info and Scores
// By default available at "ws://127.0.0.1:2947/socket"

// Mapping for Easy-to-Read WebSocket connection state
const connectionStatus = {
  [ReadyState.CONNECTING]: "Connecting ...",
  [ReadyState.OPEN]: "Connected",
  [ReadyState.CLOSING]: "Closing ...",
  [ReadyState.CLOSED]: "Disconnected",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

interface MapState {
  info: MapInfo | null;
  score: Score | null;
  isPlaying: boolean;
  visible: boolean;
}

const testingData: MapState = {
  info: {
    level_id: "BeThereForYou",
    name: "Be There For You - Beat Saber Original Soundtrack",
    sub_name: "ft. Kinnie Lane",
    artist: "Sedliv",
    mapper: "",
    characteristic: "Standard",
    difficulty: "ExpertPlus",
    duration: 171904,
    BPM: 126.0,
    PP: 0.0,
    BSRKey: "",
    coverRaw: "",
    time: 0.021484375,
    timeMultiplier: 1.0,
  },
  score: {
    time: 0.021484375,
    score: 123456,
    accuracy: 0.9876,
    combo: 123,
    missCount: 0,
    currentHealth: 0.5,
  },
  isPlaying: true,
  visible: true,
};

export default function useBeatSaber(debug = false, ip = "127.0.0.1:2947") {
  const [connectionState, setConnectionState] = useState(
    connectionStatus[ReadyState.CLOSED]
  );
  const [handshake, setHandshake] = useState<Handshake | null>(null);
  const [mapState, setMapState] = useState<MapState>(
    debug
      ? testingData
      : { info: null, score: null, isPlaying: false, visible: false }
  );

  // Connect to BeatSaberPlus to receive messages
  // If it fails, try again after 5 seconds
  const { lastJsonMessage, readyState } = useWebSocket(`ws://${ip}/socket`, {
    retryOnError: true,
    shouldReconnect: () => true,
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
  });

  useEffect(() => {
    setConnectionState(connectionStatus[readyState]);
    console.info("BeatSaberPlus WebSocket:", connectionStatus[readyState]);
  }, [readyState]);

  useEffect(() => {
    function checkPacket() {
      if (!lastJsonMessage) return;
      const packet = lastJsonMessage as Packet;

      // First message is the handshake
      // It includes info about the current player
      if (packet._type === "handshake") {
        console.info("BeatSaberPlus Handshake:", packet);
        setHandshake(packet);
        return;
      }

      const ev = packet._event;

      // Set isPlaying when pausing or resuming
      if (ev === "pause") {
        setMapState((prev) => ({ ...prev, isPlaying: false }));
        return;
      }
      if (ev === "resume") {
        setMapState((prev) => ({ ...prev, isPlaying: true }));
        return;
      }

      // Set overlay visibility based on game state
      if (ev === "gameState") {
        setMapState((prev) => ({
          ...prev,
          visible: packet.gameStateChanged === "Playing",
        }));
        return;
      }

      // Set general map info
      if (ev === "mapInfo") {
        setMapState((prev) => ({
          ...prev,
          info: packet.mapInfoChanged,
        }));
        return;
      }

      // Update the score
      if (ev === "score") {
        setMapState((prev) => ({
          ...prev,
          score: packet.scoreEvent,
        }));
        return;
      }
    }
    checkPacket();
  }, [lastJsonMessage]);

  return { connectionState, readyState, handshake, state: mapState };
}
