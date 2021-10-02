import { findPieceOnBoard, isPlayerUnderCheckMate, isPlayerUnderStaleMate } from "./getValidMoves";

export default function movePieceAPI(req, res) {
  let request = JSON.parse(req.body);
  let boardState = request.boardState;
  let square1 = request.square1;
  let square2 = request.square2;
  let turn = request.turn;
  let piece = boardState[square1.row][square1.col].piece;
  boardState[square1.row][square1.col].isOccupied = false;
  boardState[square1.row][square1.col].piece = {};
  boardState[square2.row][square2.col].piece = piece;
  boardState[square2.row][square2.col].piece.hasMoved = true;
  boardState[square2.row][square2.col].isOccupied = true;
  let newTurn = turn == "white" ? "black" : "white";
  // check if opponent is in checkmate or stalemate and return that
  let isCheckMate = isPlayerUnderCheckMate(newTurn, boardState);
  let isStaleMate = isPlayerUnderStaleMate(newTurn, boardState);
  /*
  let opponentKingPositionForMate;
  if(isCheckMate || isStaleMate)
    opponentKingPositionForMate = findPieceOnBoard(newTurn, "king", boardState);
    */
  res.status(200).json({ 
      boardState: boardState,
      turn: newTurn,
      opponentUnderCheckMate: isCheckMate,
      opponentUnderStaleMate: isStaleMate/*,
      opponentKingPosition: opponentKingPositionForMate*/
     });
}
