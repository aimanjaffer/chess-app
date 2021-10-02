export {isPlayerUnderCheckMate, isPlayerUnderStaleMate, findPieceOnBoard};
export default function getValidMovesAPI(req, res) {
    // return a list of {row,col} objects representing possible squares the piece can move to
    let request = JSON.parse(req.body);
    let boardState = request.boardState;
    let pieceInHand = request.pieceInHand;
    let pieceType = request.pieceInHand.type;
    let pieceColor = request.pieceInHand.pieceColor;
    let pieceHasMoved = request.pieceInHand.hasMoved;   
    let pieceRow = request.pieceInHand.row;
    let pieceCol = request.pieceInHand.col;
    let possibleSquares = [];
    //prevent moving pieces that will put the king in check
    //prevent king from moving to a square next to opponent king
    //TODO: castling, en passant, pawn promotion
    //handle double check, check mate, stalemate
    if(hasValidMoves(pieceColor, boardState)){
        possibleSquares = getMovesForPiece(boardState, pieceRow, pieceCol, pieceColor, pieceInHand, pieceHasMoved, pieceType);
    }
    return res.status(200).json({
        possibleSquares: possibleSquares
    });
  }
  function getMovesForPiece(boardState, pieceRow, pieceCol, pieceColor, pieceInHand, pieceHasMoved, pieceType){
      let possibleSquares = [];
      switch(pieceType){
        case "pawn":
            possibleSquares = pawnMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand, pieceHasMoved);
            break;
        case "king":
            possibleSquares = kingMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand, pieceHasMoved);
            //get possibleSquares of other color king and subtract them
            let otherKingSquare;
            let otherKingPossibleSquares;
            if(pieceColor === "white")
                otherKingSquare = findPieceOnBoard("black", "king", boardState);
            else
                otherKingSquare = findPieceOnBoard("white", "king", boardState);
            if(otherKingSquare){
                let pieceInHand = {
                    pieceColor: otherKingSquare.piece.color,
                    type: otherKingSquare.piece.type,
                    hasMoved: otherKingSquare.piece.hasMoved,
                    row: otherKingSquare.row,
                    col: otherKingSquare.col
                }
                otherKingPossibleSquares = kingMoves(boardState, otherKingSquare.row, otherKingSquare.col, otherKingSquare.piece.color, pieceInHand,otherKingSquare.piece.pieceHasMoved);
                possibleSquares = possibleSquares.filter((possibleSquare) => !(otherKingPossibleSquares.includes(possibleSquare)));
            }
            break;
        case "queen":
            possibleSquares = queenMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand);
            break;
        case "knight":
            possibleSquares = knightMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand);
            break;
        case "rook":
            possibleSquares = rookMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand);
            break;
        case "bishop":
            possibleSquares = bishopMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand);
            break;
    }
    return possibleSquares;
  }

  function queenMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand){
    let possibleSquares = [];
    let possibleSquaresBishop = bishopMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand);
    let possibleSquaresRook = rookMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand);
    possibleSquares = [...possibleSquaresBishop, ...possibleSquaresRook];
    return possibleSquares;
  }
  function knightMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand){
    let possibleSquares = [];
    let leftUp = boardState[pieceRow+2]?.[pieceCol-1];
    let leftDown = boardState[pieceRow-2]?.[pieceCol-1];
    let rightUp = boardState[pieceRow+2]?.[pieceCol+1];
    let rightDown = boardState[pieceRow-2]?.[pieceCol+1];
    let upLeft = boardState[pieceRow+1]?.[pieceCol-2];
    let downLeft = boardState[pieceRow-1]?.[pieceCol-2];
    let upRight = boardState[pieceRow+1]?.[pieceCol+2];
    let downRight = boardState[pieceRow-1]?.[pieceCol+2];
    if(leftUp && (!leftUp.isOccupied || (leftUp.piece.color !== pieceColor && leftUp.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, leftUp);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, leftUp];
    }
    if(leftDown && (!leftDown.isOccupied || (leftDown.piece.color !== pieceColor && leftDown.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, leftDown);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, leftDown];
    }    
    if(rightUp && (!rightUp.isOccupied || (rightUp.piece.color !== pieceColor && rightUp.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, rightUp);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, rightUp];
    }
    if(rightDown && (!rightDown.isOccupied || (rightDown.piece.color !== pieceColor && rightDown.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, rightDown);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, rightDown];
    }
    if(upLeft && (!upLeft.isOccupied || (upLeft.piece.color !== pieceColor && upLeft.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, upLeft);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, upLeft];
    }  
    if(downLeft && (!downLeft.isOccupied || (downLeft.piece.color !== pieceColor && downLeft.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, downLeft);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, downLeft];
    }
    if(upRight && (!upRight.isOccupied || (upRight.piece.color !== pieceColor && upRight.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, upRight);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, upRight];
    }    
    if(downRight && (!downRight.isOccupied || (downRight.piece.color !== pieceColor && downRight.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, downRight);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, downRight];
    }
    return possibleSquares;
  }
  function kingMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand, pieceHasMoved){
    let possibleSquares = [];
    let upOne = boardState[pieceRow+1]?.[pieceCol];
    let downOne = boardState[pieceRow-1]?.[pieceCol];
    let leftOne = boardState[pieceRow]?.[pieceCol-1];
    let rightOne = boardState[pieceRow]?.[pieceCol+1];
    let leftDiagonalUpOne = boardState[pieceRow+1]?.[pieceCol-1];
    let rightDiagonalUpOne = boardState[pieceRow+1]?.[pieceCol+1];
    let leftDiagonalDownOne = boardState[pieceRow-1]?.[pieceCol+1];
    let rightDiagonalDownOne = boardState[pieceRow-1]?.[pieceCol-1];
    
    if(upOne && (!upOne.isOccupied || (upOne.piece.color !== pieceColor && upOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, upOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, upOne];
    }
    if(downOne && (!downOne.isOccupied || (downOne.piece.color !== pieceColor && downOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, downOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, downOne];
    }
    if(leftOne && (!leftOne.isOccupied || (leftOne.piece.color !== pieceColor && leftOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, leftOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, leftOne];
    }
    if(rightOne && (!rightOne.isOccupied || (rightOne.piece.color !== pieceColor && rightOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, rightOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, rightOne];
    }
    if(leftDiagonalUpOne && (!leftDiagonalUpOne.isOccupied || (leftDiagonalUpOne.piece.color !== pieceColor && leftDiagonalUpOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, leftDiagonalUpOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, leftDiagonalUpOne];
    }
    if(rightDiagonalUpOne && (!rightDiagonalUpOne.isOccupied || (rightDiagonalUpOne.piece.color !== pieceColor && rightDiagonalUpOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, rightDiagonalUpOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, rightDiagonalUpOne];
    }
    if(leftDiagonalDownOne && (!leftDiagonalDownOne.isOccupied || (leftDiagonalDownOne.piece.color !== pieceColor && leftDiagonalDownOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, leftDiagonalDownOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, leftDiagonalDownOne];
    }
    if(rightDiagonalDownOne && (!rightDiagonalDownOne.isOccupied || (rightDiagonalDownOne.piece.color !== pieceColor && rightDiagonalDownOne.piece.type !== "king"))){
        let updatedBoardState = simulateMove(boardState, pieceInHand, rightDiagonalDownOne);
        if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
            possibleSquares = [...possibleSquares, rightDiagonalDownOne];
    }
    return possibleSquares;
  }
  function pawnMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand, pieceHasMoved){
    let possibleSquares = [];
    if(pieceColor === "white"){
        //console.log("move 1 step forward if not blocked");
        let upOne = boardState[pieceRow+1]?.[pieceCol];
        //console.log("upOne: ", upOne);
        if(upOne && !upOne.isOccupied){
            let updatedBoardState = simulateMove(boardState, pieceInHand, upOne);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, upOne];
        }
        if(!pieceHasMoved){
            //console.log("piece has not moved");
            let upTwo = boardState[pieceRow+2]?.[pieceCol];
            //console.log("upOne: ", upOne);
            //console.log("upTwo: ", upTwo);
            //console.log(!upOne.isOccupied);
            //console.log(!upTwo.isOccupied);
            if(upOne && upTwo && !upOne.isOccupied && !upTwo.isOccupied){
                //console.log("can move two steps forward");
                let updatedBoardState = simulateMove(boardState, pieceInHand, upTwo);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, upTwo];
            }
        }
        // attack diagonally 1 step
        let leftDiagonalOne = boardState[pieceRow+1]?.[pieceCol-1];
        if(leftDiagonalOne && leftDiagonalOne.isOccupied && leftDiagonalOne.piece.color === "black" && leftDiagonalOne.piece.type !== "king"){
            let updatedBoardState = simulateMove(boardState, pieceInHand, leftDiagonalOne);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, leftDiagonalOne];
        }
        let rightDiagonalOne = boardState[pieceRow+1]?.[pieceCol+1];
        if(rightDiagonalOne && rightDiagonalOne.isOccupied && rightDiagonalOne.piece.color === "black" && rightDiagonalOne.piece.type !== "king"){
            let updatedBoardState = simulateMove(boardState, pieceInHand, rightDiagonalOne);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, rightDiagonalOne];
        }
    }else{
        //move 1 step forward if not blocked
        let downOne = boardState[pieceRow-1]?.[pieceCol];
        if(downOne && !downOne.isOccupied){
            let updatedBoardState = simulateMove(boardState, pieceInHand, downOne);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, downOne];
        }
        if(!pieceHasMoved){
            //can move two steps forward if not blocked
            let downTwo = boardState[pieceRow-2]?.[pieceCol];
            if(downOne && downTwo && !downOne.isOccupied && !downTwo.isOccupied){
                let updatedBoardState = simulateMove(boardState, pieceInHand, downTwo);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, downTwo];
            } 
        }
        // attack diagonally 1 step
        let leftDiagonalOne = boardState[pieceRow-1]?.[pieceCol+1];
        if(leftDiagonalOne && leftDiagonalOne.isOccupied && leftDiagonalOne.piece.color === "white" && leftDiagonalOne.piece.type !== "king"){
            let updatedBoardState = simulateMove(boardState, pieceInHand, leftDiagonalOne);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, leftDiagonalOne];
        }
        let rightDiagonalOne = boardState[pieceRow-1]?.[pieceCol-1];
        if(rightDiagonalOne && rightDiagonalOne.isOccupied && rightDiagonalOne.piece.color === "white" && rightDiagonalOne.piece.type !== "king"){
            let updatedBoardState = simulateMove(boardState, pieceInHand, rightDiagonalOne);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, rightDiagonalOne];
        }
    }
    return possibleSquares;
  }
  function bishopMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand){
        let possibleSquares = [];
        let x = pieceCol + 1;
        let y = pieceRow + 1;
        while(x<8 && y<8){
            //console.log("increase both");
            let square = boardState[y]?.[x];
            let isSquareOccupied = square?.isOccupied;
            if(!isSquareOccupied){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
                break;
            }else{
                break;
            }
            y++;
            x++;
        }
        x = pieceCol - 1;
        y = pieceRow - 1;
        while(x>=0 && y>=0){
            //console.log("decrease both");
            let square = boardState[y]?.[x];
            let isSquareOccupied = square?.isOccupied;
            if(!isSquareOccupied){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
                break;
            }else{
                break;
            }
            y--;
            x--;
        }
        
        x = pieceCol - 1;
        y = pieceRow + 1;
        while(x>=0 && y<8){
            //console.log("increase y, decrease x");
            let square = boardState[y]?.[x];
            let isSquareOccupied = square?.isOccupied;
            if(!isSquareOccupied){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
                break;
            }else{
                break;
            }
            y++;
            x--;
        }
        
        x = pieceCol + 1;
        y = pieceRow - 1;
        while(x<8 && y>=0){
            //console.log("decrease y, increase x");
            let square = boardState[y]?.[x];
            let isSquareOccupied = square?.isOccupied;
            if(!isSquareOccupied){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
                let updatedBoardState = simulateMove(boardState, pieceInHand, square);
                if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                    possibleSquares = [...possibleSquares, square];
                break;
            }else{
                break;
            }
            y--;
            x++;
        }
        return possibleSquares;
  }
  function rookMoves(boardState, pieceRow, pieceCol, pieceColor, pieceInHand){
    let possibleSquares = [];
    let y = pieceRow + 1;
    while(y < 8){
        //console.log("up");
        let square = boardState[y]?.[pieceCol];
        let isSquareOccupied = square?.isOccupied;
        if(!isSquareOccupied){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
            break;
        }else{
            break;
        }
        y++;
    }
    y = pieceRow - 1;
    while(y >= 0){
        //console.log("down");
        let square = boardState[y]?.[pieceCol];
        let isSquareOccupied = square?.isOccupied;
        if(!isSquareOccupied){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
            break;
        }else{
            break;
        }
        y--;
    }
    let x = pieceCol + 1;
    while(x < 8){
        //console.log("right");
        let square = boardState[pieceRow]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(!isSquareOccupied){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
            break;
        }else{
            break;
        }
        x++;
    }
    x = pieceCol - 1;
    while(x >= 0){
        //console.log("left");
        let square = boardState[pieceRow]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(!isSquareOccupied){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
            let updatedBoardState = simulateMove(boardState, pieceInHand, square);
            if(!isPlayerUnderCheck(pieceColor, updatedBoardState))
                possibleSquares = [...possibleSquares, square];
            break;
        }else{
            break;
        }
        x--;
    }
    return possibleSquares;
  }

  function isPlayerUnderCheck(playerColor, boardState){
    //console.log("entered method isPlayerUnderCheck");
	for(let i = 0; i < 8; i++){
        //console.log("row: ", boardRow);
        for(let j = 0; j < 8; j++){
            let square = boardState[i][j];
            //console.log("square: ", square);
            if(square.isOccupied && square.piece.color !== playerColor){
                //console.log("square isOccupied with opponent's piece");
                if(isPieceAttackingOpponentKing(square, boardState)){
                    //console.log(playerColor," player is under check");
                    return true;
                }  
            }
        }
    }
    //console.log("exiting method isPlayerUnderCheck with false");
    return false;
}

function isPieceAttackingOpponentKing(square, boardState){
    //console.log("entered isPieceAttackingOpponentKing for square: ", square);
    let piece = square.piece;
    let pieceColor = piece.color;
    let pieceCol = square.col;
    let pieceRow = square.row;
    //console.log("piece: ", pieceColor, " ", piece.type);
    //not considering king here because king cant attack opponent's king
    switch(piece.type){
        case "pawn":
            if(pieceColor === "white"){                
                let leftDiagonalOne = boardState[pieceRow+1]?.[pieceCol-1];
                if(leftDiagonalOne && leftDiagonalOne.isOccupied && leftDiagonalOne.piece.color === "black" && leftDiagonalOne.piece.type === "king"){
                    return true;
                }
                let rightDiagonalOne = boardState[pieceRow+1]?.[pieceCol+1];
                if(rightDiagonalOne && rightDiagonalOne.isOccupied && rightDiagonalOne.piece.color === "black" && rightDiagonalOne.piece.type === "king"){
                    return true;
                }
            }else{
                let leftDiagonalOne = boardState[pieceRow-1]?.[pieceCol+1];
                if(leftDiagonalOne && leftDiagonalOne.isOccupied && leftDiagonalOne.piece.color === "white" && leftDiagonalOne.piece.type === "king"){
                    return true;
                }
                let rightDiagonalOne = boardState[pieceRow-1]?.[pieceCol-1];
                if(rightDiagonalOne && rightDiagonalOne.isOccupied && rightDiagonalOne.piece.color === "white" && rightDiagonalOne.piece.type === "king"){
                    return true;
                }
            }            
            return false;
        case "queen":
            return (isKingAttackedDiagonally(boardState, pieceRow, pieceCol, pieceColor) || isKingAttackedHorizontallyVertically(boardState, pieceRow, pieceCol, pieceColor));
        case "bishop":
            return isKingAttackedDiagonally(boardState, pieceRow, pieceCol, pieceColor);
        case "rook":
            return isKingAttackedHorizontallyVertically(boardState, pieceRow, pieceCol, pieceColor);
        case "knight":
            return isKingAttackedByKnight(boardState, pieceRow, pieceCol, pieceColor);
        case "king":
            return isKingAttackedByKing(boardState, pieceRow, pieceCol, pieceColor);
    }
    //console.log("exiting isPieceAttackingOpponentKing");
}
function isKingAttackedByKing(boardState, pieceRow, pieceCol, pieceColor){
    let upOne = boardState[pieceRow+1]?.[pieceCol];
    let downOne = boardState[pieceRow-1]?.[pieceCol];
    let leftOne = boardState[pieceRow]?.[pieceCol-1];
    let rightOne = boardState[pieceRow]?.[pieceCol+1];
    let leftDiagonalUpOne = boardState[pieceRow+1]?.[pieceCol-1];
    let rightDiagonalUpOne = boardState[pieceRow+1]?.[pieceCol+1];
    let leftDiagonalDownOne = boardState[pieceRow-1]?.[pieceCol+1];
    let rightDiagonalDownOne = boardState[pieceRow-1]?.[pieceCol-1];
    
    if(upOne &&  (upOne.piece.color !== pieceColor && upOne.piece.type === "king")){
        return true;
    }
    if(downOne && (downOne.piece.color !== pieceColor && downOne.piece.type === "king")){
        return true;
    }
    if(leftOne && (leftOne.piece.color !== pieceColor && leftOne.piece.type === "king")){
        return true;
    }
    if(rightOne && (rightOne.piece.color !== pieceColor && rightOne.piece.type === "king")){
        return true;
    }
    if(leftDiagonalUpOne && (leftDiagonalUpOne.piece.color !== pieceColor && leftDiagonalUpOne.piece.type === "king")){
        return true;
    }
    if(rightDiagonalUpOne && (rightDiagonalUpOne.piece.color !== pieceColor && rightDiagonalUpOne.piece.type === "king")){
        return true;
    }
    if(leftDiagonalDownOne && (leftDiagonalDownOne.piece.color !== pieceColor && leftDiagonalDownOne.piece.type === "king")){
        return true;
    }
    if(rightDiagonalDownOne && (rightDiagonalDownOne.piece.color !== pieceColor && rightDiagonalDownOne.piece.type === "king")){
        return true;
    }
    return false;
}
function isKingAttackedByKnight(boardState, pieceRow, pieceCol, pieceColor){
    let leftUp = boardState[pieceRow+2]?.[pieceCol-1];
    let leftDown = boardState[pieceRow-2]?.[pieceCol-1];
    let rightUp = boardState[pieceRow+2]?.[pieceCol+1];
    let rightDown = boardState[pieceRow-2]?.[pieceCol+1];
    let upLeft = boardState[pieceRow+1]?.[pieceCol-2];
    let downLeft = boardState[pieceRow-1]?.[pieceCol-2];
    let upRight = boardState[pieceRow+1]?.[pieceCol+2];
    let downRight = boardState[pieceRow-1]?.[pieceCol+2];
    if(leftUp && (leftUp.piece.color !== pieceColor && leftUp.piece.type === "king")){
            return true;
    }
    if(leftDown && (leftDown.piece.color !== pieceColor && leftDown.piece.type === "king")){
            return true;
    }    
    if(rightUp && (rightUp.piece.color !== pieceColor && rightUp.piece.type === "king")){
            return true;
    }
    if(rightDown && (rightDown.piece.color !== pieceColor && rightDown.piece.type === "king")){
            return true;
    }
    if(upLeft && (upLeft.piece.color !== pieceColor && upLeft.piece.type === "king")){
            return true;
    }  
    if(downLeft && (downLeft.piece.color !== pieceColor && downLeft.piece.type === "king")){
            return true;
    }
    if(upRight && (upRight.piece.color !== pieceColor && upRight.piece.type === "king")){
            return true;
    }    
    if(downRight && (downRight.piece.color !== pieceColor && downRight.piece.type === "king")){
            return true;
    }
    return false;    
}
function isKingAttackedDiagonally(boardState, pieceRow, pieceCol, pieceColor){
    let x = pieceCol + 1;
    let y = pieceRow + 1;
    //console.log("entered isKingAttackedDiagonally");
    while(x<8 && y<8){
        //console.log("increase both");
        let square = boardState[y]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        y++;
        x++;
    }
    x = pieceCol - 1;
    y = pieceRow - 1;
    while(x>=0 && y>=0){
        //console.log("decrease both");
        let square = boardState[y]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        y--;
        x--;
    }
    
    x = pieceCol - 1;
    y = pieceRow + 1;
    while(x>=0 && y<8){
        //console.log("increase y, decrease x");
        let square = boardState[y]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        y++;
        x--;
    }
    
    x = pieceCol + 1;
    y = pieceRow - 1;
    while(x<8 && y>=0){
        //console.log("decrease y, increase x");
        let square = boardState[y]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        y--;
        x++;
    }
    //console.log("exiting isKingAttackedDiagonally with false");
    return false;
}

function isKingAttackedHorizontallyVertically(boardState, pieceRow, pieceCol, pieceColor){
    //console.log("entered isKingAttackedHorizontallyVertically");
    let y = pieceRow + 1;
    while(y < 8){
        //console.log("up");
        let square = boardState[y]?.[pieceCol];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        y++;
    }
    y = pieceRow - 1;
    while(y >= 0){
        //console.log("down");
        let square = boardState[y]?.[pieceCol];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        y--;
    }
    let x = pieceCol + 1;
    while(x < 8){
        //console.log("right");
        let square = boardState[pieceRow]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        x++;
    }
    x = pieceCol - 1;
    while(x >= 0){
        //console.log("left");
        let square = boardState[pieceRow]?.[x];
        let isSquareOccupied = square?.isOccupied;
        if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type === "king")){
            return true;
        }else if(isSquareOccupied){
            break;
        }
        x--;
    }
    //console.log("exited isKingAttackedHorizontallyVertically with false");
    return false;
}

function findPieceOnBoard(pieceColor, pieceType, boardState){
	for(let row in boardState){
        //console.log(boardState[row]);
        let square = boardState[row].filter((square) => square.isOccupied && square.piece.type === pieceType && square.piece.color === pieceColor);
        if(square.length > 0){
            return square[0];
        }
    }
    return [];
}

function hasValidMoves(playerColor, boardState){
    let validMoveCount = 0;
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            let square = boardState[i][j];
            if(square.isOccupied && square.piece.color === playerColor){
                let pieceInHand = {
                    pieceColor: square.piece.color,
                    type: square.piece.type,
                    hasMoved: square.piece.hasMoved,
                    row: i,
                    col: j
                };
                validMoveCount += getMovesForPiece(boardState, i, j, playerColor, pieceInHand, square.piece.hasMoved, square.piece.type).length;
                if(validMoveCount > 0)
                    return true; 
            }
        }
    }
    return false;
}

// returns the new board state after moving piece at square1 to square2
 function simulateMove(boardState, square1, square2){
     //console.log("entered simulateMove");
     //console.log("square1: ", square1);
     //console.log("square2: ", square2);
    let updatedBoardState = JSON.parse(JSON.stringify(boardState));
    let square1Copy = JSON.parse(JSON.stringify(square1));
    let square2Copy = JSON.parse(JSON.stringify(square2));
    let piece = updatedBoardState[square1Copy.row][square1Copy.col].piece;
    updatedBoardState[square1Copy.row][square1Copy.col].isOccupied = false;
    updatedBoardState[square1Copy.row][square1Copy.col].piece = {};
    updatedBoardState[square2Copy.row][square2Copy.col].piece = piece;
    updatedBoardState[square2Copy.row][square2Copy.col].piece.hasMoved = true;
    updatedBoardState[square2Copy.row][square2Copy.col].isOccupied = true;
    //console.log("exiting simulateMove with boardState: ");
    //console.log(updatedBoardState);
    return updatedBoardState;
 }

 function isPlayerUnderCheckMate(playerColor, boardState){
    if(isPlayerUnderCheck(playerColor, boardState) && !(hasValidMoves(playerColor, boardState))){
        console.log(playerColor, "is in checkmate");
        return true;
    }
    return false;
 }

 function isPlayerUnderStaleMate(playerColor, boardState){
    if(!isPlayerUnderCheck(playerColor, boardState) && !(hasValidMoves(playerColor, boardState))){
        console.log(playerColor, "is in stalemate");
        return true;
    }
    return false;    
 }