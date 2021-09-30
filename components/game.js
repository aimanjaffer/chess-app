import Board from "./board";
import {useEffect, useState} from "react";


const Game = (props) =>{
    const [isOngoing, setIsOngoing] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [pieceInHand, setPieceInHand] = useState();
    const [highlightedSquares, setHighlightedSquares] = useState([]);
    useEffect(() => {
        if(pieceInHand){
            const requestOptions = {
                method:"POST",
                body: JSON.stringify({boardState: props.boardState, pieceInHand})
            }
            fetch('/api/getValidMoves', requestOptions)
            .then(response => response.json())
            .then(response => setHighlightedSquares(response.possibleSquares));
        }
    }, [pieceInHand]);

    const pieceTouched = (color, type, row, col, hasMoved) => {
        //console.log(color + " "+ type + " was clicked at: ("+ row+","+col+")");
        if(props.turn === props.playerColor){
            if(color === props.playerColor){
                setPieceInHand({
                    pieceColor: color,
                    type: type,
                    hasMoved: hasMoved,
                    row: row,
                    col: col
                });
            }else{
                if(pieceInHand){
                    //console.log("Move registered");
                    if(highlightedSquares.filter((highlightedSquare) => highlightedSquare.row === row && highlightedSquare.col === col).length > 0){
                        const messageBody = {
                            isOngoing: isOngoing,
                            isStarted: isStarted,
                            turn: props.turn,
                            playerColor: props.playerColor,
                            boardState: props.boardState,
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
                        fetch('/api/movePiece', requestOptions)
                        .then(response => response.json())
                        .then(response => {
                            props.setTurnAndBoardState(response.turn, response.boardState);
                            props.socket.emit("movedPiece", {
                                gameId: props.gameId,
                                playerColor: props.playerColor,
                                boardState: response.boardState,
                                turn: response.turn
                            });
                        }).then(()=>{
                            setPieceInHand(undefined);
                            setHighlightedSquares([]);
                        });
                    }     
                }            
            }
        }
    }
    const emptySquareTouched = (color, row, col) => {
        if((props.turn === props.playerColor) && pieceInHand){
            //console.log("Move registered");
            if(highlightedSquares.filter((highlightedSquare) => highlightedSquare.row === row && highlightedSquare.col === col).length > 0){
                const messageBody = {
                    isOngoing: isOngoing,
                    isStarted: isStarted,
                    turn: props.turn,
                    playerColor: props.playerColor,
                    boardState: props.boardState,
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
                fetch('/api/movePiece', requestOptions)
                .then(response => response.json())
                .then(response => {
                    props.setTurnAndBoardState(response.turn, response.boardState);
                    props.socket.emit("movedPiece", {
                        gameId: props.gameId,
                        playerColor: props.playerColor,
                        boardState: response.boardState,
                        turn: response.turn
                    });
                })
                .then(()=>{
                    setPieceInHand(undefined);
                    setHighlightedSquares([]);
                });
            }     
        }
    }
    
    return (
    <>
    <h1>Opponent Name / Email displayed here</h1>
    <h1>Game status displayed here</h1>
    <div className="container mx-auto border-8 border-black">
    <Board boardState={props.boardState} pieceTouched={pieceTouched} emptySquareTouched={emptySquareTouched} playerColor={props.playerColor} highlightedSquares={highlightedSquares}/>
    </div>
    <h1>Our players Name / Email displayed here</h1>
    {props.playerColor === props.turn ? <div>Your turn. Please make a move.</div> : <div>Opponent's turn. Please wait.</div>}
    </>
    );
}
export default Game;