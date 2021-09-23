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
        if(color === playerColor){
            setPieceInHand({
                color: color,
                type: type,
                hasMoved: hasMoved,
                row: row,
                col: col
            });
        }else{
            if(pieceInHand){
                console.log("Move registered, now make the request and clear pieceInHand update gameState based on response from server");
                    const messageBody = {
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
                    .then(response => console.log(response))
                    .then(setPieceInHand(undefined));
                    //TODO: set board state here to the updated value received from backend
            }            
        }
    }
    const emptySquareTouched = (color, row, col) => {
        if(pieceInHand){
            console.log("Move registered, now make the request and clear pieceInHand update gameState based on response from server");
                const messageBody = {
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
                .then(response => console.log(response))
                .then(setPieceInHand(undefined));
                //TODO: set board state here to the updated value received from backend
        }
    }
    
    return <Board boardState={boardState} pieceTouched={pieceTouched} emptySquareTouched={emptySquareTouched}/>;
}
export default Game;