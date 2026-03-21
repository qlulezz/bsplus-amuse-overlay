export type Packet =
  | Handshake
  | GameStateEvent
  | ResumeEvent
  | PauseEvent
  | MapInfoEvent
  | ScoreEvent;

export interface Handshake {
  GameVersion: string;
  LocalUserID: string;
  LocalUserName: string;
  ProtocolVersion: number;
  _type: "handshake";
}

export interface GameStateEvent {
  _type: "event";
  _event: "gameState";
  gameStateChanged: "Menu" | "Playing";
}

export interface ResumeEvent {
  _type: "event";
  _event: "resume";
  resumeTime: number;
}

export interface PauseEvent {
  _type: "event";
  _event: "pause";
  pauseTime: number;
}

export interface MapInfoEvent {
  _type: "event";
  _event: "mapInfo";
  mapInfoChanged: MapInfo;
}

export interface MapInfo {
  level_id: string;
  name: string;
  sub_name: string;
  artist: string;
  mapper: string;
  characteristic: string;
  difficulty: string;
  duration: number;
  BPM: number;
  PP: number;
  BSRKey: string;
  coverRaw: string;
  time: number;
  timeMultiplier: number;
}

export interface ScoreEvent {
  _type: "event";
  _event: "score";
  scoreEvent: Score;
}

export interface Score {
  time: number;
  score: number;
  accuracy: number;
  combo: number;
  missCount: number;
  currentHealth: number;
}
