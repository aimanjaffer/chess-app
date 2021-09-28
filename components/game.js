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
    const [gameId, setGameId] = useState("abcd"); //TODO: make a call to server to set this once challenge functionality is ready
 
        useEffect(()=>{
        if(props.socket !== null){
            props.socket.on("connect", () => {
                //console.log(socket.id);
                props.socket.emit("create-new-or-join-existing-game",{
                    gameId: gameId
                });
              });
            props.socket.on("playerColorSet", (message)=>{
                //console.log("player color from websocket server");
                setPlayerColor(message.playerColor);
            });
            props.socket.on("opponentMovedPiece", (message)=>{
                //console.log("opponent moved piece");
                setBoardState(message.boardState);
                setTurn(message.turn);
            });
        }
    },[props.socket]);
        
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
                    //console.log("Move registered");
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
                            setBoardState(response.boardState);
                            setTurn(response.turn);
                            props.socket.emit("movedPiece", {
                                gameId: gameId,
                                playerColor: playerColor,
                                boardState: response.boardState,
                                turn: response.turn
                            });
                        })
                        .then(setPieceInHand(undefined));
                        
                }            
            }
        }
    }
    const emptySquareTouched = (color, row, col) => {
        if((turn === playerColor) && pieceInHand){
            //console.log("Move registered");
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
                    setBoardState(response.boardState);
                    setTurn(response.turn);
                    props.socket.emit("movedPiece", {
                        gameId: gameId,
                        playerColor: playerColor,
                        boardState: response.boardState,
                        turn: response.turn
                    });
                })
                .then(setPieceInHand(undefined));
                
        }
    }
    
    return (
    <>
    <h1>Opponent Name / Email displayed here</h1>
    <h1>Game status displayed here</h1>
    <div className="container mx-auto border-8 border-black">
    <Board boardState={boardState} pieceTouched={pieceTouched} emptySquareTouched={emptySquareTouched} playerColor={playerColor}/>
    </div>
    <h1>Our players Name / Email displayed here</h1>
    {playerColor === turn ? <div>Your turn. Please make a move.</div> : <div>Opponent's turn. Please wait.</div>}
    </>
    );
}
export default Game;