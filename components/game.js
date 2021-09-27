import Board from "./board";
import {useEffect, useState} from "react";
import { initialBoardState } from "../providers/game-context";
import { io } from "socket.io-client";
const Game = (props) =>{
    const [isOngoing, setIsOngoing] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [boardState, setBoardState] = useState(initialBoardState);
    const [turn, setTurn] = useState("white");
    const [playerColor, setPlayerColor] = useState("white");
    const [pieceInHand, setPieceInHand] = useState();
    const [gameId, setGameId] = useState("abcd");
    const [socket, setSocket] = useState(null);
    useEffect(()=>{
        const newSocket = io("ws://localhost:3001", {
            reconnectionDelayMax: 10000        
        });
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);


        useEffect(()=>{
        if(socket !== null){
            socket.on("connect", () => {
                //console.log(socket.id);
                socket.emit("create-new-or-join-existing-game",{
                    gameId: gameId
                });
              });
            socket.on("playerColorSet", (message)=>{
                //console.log("player color from websocket server");
                setPlayerColor(message.playerColor);
            });
            socket.on("opponentMovedPiece", (message)=>{
                //console.log("opponent moved piece");
                setBoardState(message.boardState);
                setTurn(message.turn);
            });
        }
    },[socket]);
        
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
                            socket.emit("movedPiece", {
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
                    socket.emit("movedPiece", {
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
    <div className="container mx-auto border-8 border-black">
    <Board boardState={boardState} pieceTouched={pieceTouched} emptySquareTouched={emptySquareTouched} playerColor={playerColor}/>
    </div> 
    {playerColor === turn ? <div>Your turn. Please make a move.</div> : <div>Opponent's turn. Please wait.</div>}
    </>
    );
}
export default Game;