export default function movePieceAPI(req, res) {
  let request = JSON.parse(req.body);
  let boardState = request.boardState;
  let square1 = request.square1;
  let square2 = request.square2;
  let turn = request.turn;
  // TODO: allow only valid moves and check if playerColor === pieceColor === turn
  let piece = boardState[square1.row][square1.col].piece;
  piece.hasMoved = true;
  boardState[square1.row][square1.col].isOccupied = false;
  boardState[square1.row][square1.col].piece = {};
  boardState[square2.row][square2.col].piece = piece;
  boardState[square2.row][square2.col].isOccupied = true;
  let newTurn = turn == "white" ? "black" : "white";

  res.status(200).json({ boardState: boardState, turn: newTurn })
}
