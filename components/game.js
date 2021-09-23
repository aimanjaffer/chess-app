import Board from "./board";
import {useState} from "react";
import { initialBoardState } from "../providers/game-context";
const Game = (props) =>{
    const [isOngoing, setIsOngoing] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [boardState, setBoardState] = useState(initialBoardState);
    const [turn, setTurn] = useState("white");
    const [playerColor, setPlayerColor] = useState("white");
    return <Board boardState={boardState}/>;
}
export default Game;