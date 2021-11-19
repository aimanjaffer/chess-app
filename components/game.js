import Board from "./board";
import {useEffect, useState} from "react";
import Modal from "./modal";


const Game = (props) =>{
    const [isOngoing, setIsOngoing] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [pieceInHand, setPieceInHand] = useState();
    const [highlightedSquares, setHighlightedSquares] = useState([]);
    const [opponentUnderCheckMate, setOpponentUnderCheckMate] = useState(false);
    const [opponentUnderStaleMate, setOpponentUnderStaleMate] = useState(false);
    const [opponentDisconnected, setOpponentDisconnected] = useState(false);
    const [playerUnderCheckMate, setPlayerUnderCheckMate] = useState(false);
    const [playerUnderStaleMate, setPlayerUnderStaleMate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalClosed, setModalClosed] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    useEffect(()=>{
        if(props.socket != null && opponentUnderCheckMate){
            props.socket.emit("opponentPlayerUnderCheckMate",{
                gameId: props.gameId,
                playerColor: (props.playerColor === "white") ? "black" : "white"
            });
        }
    }, [props.socket, opponentUnderCheckMate]);

    useEffect(()=>{
        if(props.socket != null && opponentUnderStaleMate){
            props.socket.emit("opponentPlayerUnderStaleMate",{
                gameId: props.gameId,
                playerColor: (props.playerColor === "white") ? "black" : "white"
            });
        }
    }, [props.socket, opponentUnderStaleMate]);

    useEffect(()=>{
        if(props.socket != null){
            props.socket.on("playerUnderStaleMate", () => {
                setPlayerUnderStaleMate(true);
            });
            props.socket.on("playerUnderCheckMate", () => {
                setPlayerUnderCheckMate(true);
            });
            props.socket.on("opponentDisconnected", () => {
                console.log("opponent has disconnected");
                setOpponentDisconnected(true);
            })
        }
    },[props.socket]);

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
    useEffect(() => {
        if(opponentDisconnected || playerUnderStaleMate || playerUnderCheckMate || opponentUnderCheckMate || opponentUnderStaleMate){
            if(playerUnderStaleMate || opponentUnderStaleMate){
                setModalMessage("Game is a draw");
                setModalTitle("Stalemate");
            }    
            if(playerUnderCheckMate){
                setModalMessage("Ooops! You Lost");
                setModalTitle("Checkmate");
            }
            if(opponentUnderCheckMate){
                setModalMessage("Woohoo! You won");
                setModalTitle("Checkmate");
            }
            if(opponentDisconnected){
                setModalMessage("You win");
                setModalTitle("Your opponent has disconnected");
            }
            if(!modalClosed)
                setShowModal(true);
        }
    });
    
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
                            setOpponentUnderCheckMate(response.opponentUnderCheckMate);
                            setOpponentUnderStaleMate(response.opponentUnderStaleMate);
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
                    setOpponentUnderCheckMate(response.opponentUnderCheckMate);
                    setOpponentUnderStaleMate(response.opponentUnderStaleMate);
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
    function setCloseModal(){
        setShowModal(false);
        setModalClosed(true);
    }
    return (
    <>
    
    {showModal && <Modal message={modalMessage} title={modalTitle} closeModal={setCloseModal}/>}
    <div className="container mx-auto border-8 border-black">
    <Board boardState={props.boardState} pieceTouched={pieceTouched} emptySquareTouched={emptySquareTouched} playerColor={props.playerColor} highlightedSquares={highlightedSquares}/>
    </div>
    {props.playerColor === props.turn ? <div className="text-2xl font-bold text-green-500 bg-black p-2 m-2 rounded text-center">Your turn. Please make a move.</div> : <div className="text-2xl font-bold text-red-500 bg-black p-2 m-2 rounded text-center">Opponent's turn. Please wait.</div>}
    </>
    );
}
export default Game;