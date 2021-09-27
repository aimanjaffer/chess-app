import Board from "./board";
import {useEffect, useState} from "react";
import { initialBoardState } from "../providers/game-context";
const Game = (props) =>{
    const [isOngoing, setIsOngoing] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [boardState, setBoardState] = useState(initialBoardState);
    const [turn, setTurn] = useState("white");
    const [playerColor, setPlayerColor] = useState("white");
    const [pieceInHand, setPieceInHand] = useState();
    const pieceTouched = (color, type, row, col, hasMoved) => {
        //console.log(color + " "+ type + " was clicked at: ("+ row+","+col+")");
        if(turn === playerColor){
            if(color === playerColor){
                setPieceInHand({
                    pieceColor: color,
                    type: type,
                    hasMoved: hasMoved,
                    row: row,
                    col: col
                });
                //TODO: get all valid moves with that piece and highlight the squares
            }else{
                if(pieceInHand){
                    console.log("Move registered");
                        const messageBody = {
                            isOngoing: isOngoing,
                            isStarted: isStarted,
                            turn: turn,
                            playerColor: playerColor,
                            boardState: boardState,
                            square1: pieceInHand,
                            square2: {
                                pieceColor: color,
                                type: type,
                                hasMoved: hasMoved,
                                row: row,
                                col: col
                            } 
                        };
                        const requestOptions = {
                            method: "POST",
                            body: JSON.stringify(messageBody)
                        };
                        fetch('/api/hello', requestOptions)
                        .then(response => response.json())
                        .then(response => {
                            setBoardState(response.boardState)
                            setTurn(response.turn)
                        })
                        .then(setPieceInHand(undefined));
                        //TODO: set board state here to the updated value received from backend
                }            
            }
        }
    }
    const emptySquareTouched = (color, row, col) => {
        if((turn === playerColor) && pieceInHand){
            console.log("Move registered");
                const messageBody = {
                    isOngoing: isOngoing,
                    isStarted: isStarted,
                    turn: turn,
                    playerColor: playerColor,
                    boardState: boardState,
                    square1: pieceInHand,
                    square2: {
                        squareColor: color,
                        row: row,
                        col: col
                    } 
                };
                const requestOptions = {
                    method: "POST",
                    body: JSON.stringify(messageBody)
                };
                fetch('/api/hello', requestOptions)
                .then(response => response.json())
                .then(response => {
                    setBoardState(response.boardState)
                    setTurn(response.turn)
                })
                .then(setPieceInHand(undefined));
                //TODO: set board state here to the updated value received from backend
        }
    }
    
    return <Board boardState={boardState} pieceTouched={pieceTouched} emptySquareTouched={emptySquareTouched}/>;
}
export default Game;