import { combineReducers } from "redux";
import room from "./room";
import me from "./me";
import producers from "./producers";
import peers from "./peers";
import lobbyPeers from "./lobbyPeers";
import consumers from "./consumers";
import peerVolumes from "./peerVolumes";
import notifications from "./notifications";
import chat from "./chat";
import toolarea from "./toolarea";
import settings from "./settings";
import transports from "./transports";
import draw from "./draw";
import intl from "./intl";
// import { intlReducer } from 'react-intl-redux';

export default combineReducers({
  room,
  me,
  producers,
  consumers,
  transports,
  peers,
  lobbyPeers,
  peerVolumes,
  notifications,
  chat,
  toolarea,
  settings,
  draw,
  // intl : intlReducer
  intl
});
