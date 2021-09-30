export default function getValidMovesAPI(req, res) {
    // return a list of {row,col} objects representing possible squares the piece can move to
    let request = JSON.parse(req.body);
    let possibleSquares = [];
    let boardState = request.boardState;
    let pieceType = request.pieceInHand.type;
    let pieceColor = request.pieceInHand.pieceColor;
    let pieceHasMoved = request.pieceInHand.hasMoved;   
    let pieceRow = request.pieceInHand.row;
    let pieceCol = request.pieceInHand.col;
    //TODO: prevent moving pieces that will put the king in check
    //TODO: prevent moving to squares that put the king in check, prevent king from killing pieces that are defended, moving to a square next to opponent king
    switch(pieceType){
        case "pawn":
        if(pieceColor === "white"){
            //move 1 step forward if not blocked
            let upOne = boardState[pieceRow+1]?.[pieceCol];
            if(upOne && !upOne.isOccupied)
                possibleSquares = [...possibleSquares, upOne];
            if(!pieceHasMoved){
                //can move two steps forward if not blocked
                let upTwo = boardState[pieceRow+2]?.[pieceCol];
                if(upOne && upTwo && !upOne.isOccupied && !upTwo.isOccupied)
                    possibleSquares = [...possibleSquares, upTwo];
            }
            // attack diagonally 1 step
            let leftDiagonalOne = boardState[pieceRow+1]?.[pieceCol-1];
            if(leftDiagonalOne && leftDiagonalOne.isOccupied && leftDiagonalOne.piece.color === "black" && leftDiagonalOne.piece.type !== "king"){
                possibleSquares = [...possibleSquares, leftDiagonalOne];
            }
            let rightDiagonalOne = boardState[pieceRow+1]?.[pieceCol+1];
            if(rightDiagonalOne && rightDiagonalOne.isOccupied && rightDiagonalOne.piece.color === "black" && rightDiagonalOne.piece.type !== "king"){
                possibleSquares = [...possibleSquares, rightDiagonalOne];
            }
        }else{
            //move 1 step forward if not blocked
            let downOne = boardState[pieceRow-1]?.[pieceCol];
            if(downOne && !downOne.isOccupied)
                possibleSquares = [...possibleSquares, downOne];
            if(!pieceHasMoved){
                //can move two steps forward if not blocked
                let downTwo = boardState[pieceRow-2]?.[pieceCol];
                if(downOne && downTwo && !downOne.isOccupied && !downTwo.isOccupied)
                    possibleSquares = [...possibleSquares, downTwo];
            }
            // attack diagonally 1 step
            let leftDiagonalOne = boardState[pieceRow-1]?.[pieceCol+1];
            if(leftDiagonalOne && leftDiagonalOne.isOccupied && leftDiagonalOne.piece.color === "white" && leftDiagonalOne.piece.type !== "king"){
                possibleSquares = [...possibleSquares, leftDiagonalOne];
            }
            let rightDiagonalOne = boardState[pieceRow-1]?.[pieceCol-1];
            if(rightDiagonalOne && rightDiagonalOne.isOccupied && rightDiagonalOne.piece.color === "white" && rightDiagonalOne.piece.type !== "king"){
                possibleSquares = [...possibleSquares, rightDiagonalOne];
            }
        }
            break;
        case "king":
        let upOne = boardState[pieceRow+1]?.[pieceCol];
        let downOne = boardState[pieceRow-1]?.[pieceCol];
        let leftOne = boardState[pieceRow]?.[pieceCol-1];
        let rightOne = boardState[pieceRow]?.[pieceCol+1];
        let leftDiagonalUpOne = boardState[pieceRow+1]?.[pieceCol-1];
        let rightDiagonalUpOne = boardState[pieceRow+1]?.[pieceCol+1];
        let leftDiagonalDownOne = boardState[pieceRow-1]?.[pieceCol+1];
        let rightDiagonalDownOne = boardState[pieceRow-1]?.[pieceCol-1];
        
        if(upOne && (!upOne.isOccupied || (upOne.piece.color !== pieceColor && upOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, upOne];
        if(downOne && (!downOne.isOccupied || (downOne.piece.color !== pieceColor && downOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, downOne];
        if(leftOne && (!leftOne.isOccupied || (leftOne.piece.color !== pieceColor && leftOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, leftOne];
        if(rightOne && (!rightOne.isOccupied || (rightOne.piece.color !== pieceColor && rightOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, rightOne];
        if(leftDiagonalUpOne && (!leftDiagonalUpOne.isOccupied || (leftDiagonalUpOne.piece.color !== pieceColor && leftDiagonalUpOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, leftDiagonalUpOne];
        if(rightDiagonalUpOne && (!rightDiagonalUpOne.isOccupied || (rightDiagonalUpOne.piece.color !== pieceColor && rightDiagonalUpOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, rightDiagonalUpOne];
        if(leftDiagonalDownOne && (!leftDiagonalDownOne.isOccupied || (leftDiagonalDownOne.piece.color !== pieceColor && leftDiagonalDownOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, leftDiagonalDownOne];
        if(rightDiagonalDownOne && (!rightDiagonalDownOne.isOccupied || (rightDiagonalDownOne.piece.color !== pieceColor && rightDiagonalDownOne.piece.type !== "king")))
            possibleSquares = [...possibleSquares, rightDiagonalDownOne];
            break;
        case "queen":
           let possibleSquaresBishop = bishopMoves(boardState, pieceRow, pieceCol, pieceColor);
           let possibleSquaresRook = rookMoves(boardState, pieceRow, pieceCol, pieceColor);
           possibleSquares = [...possibleSquaresBishop, ...possibleSquaresRook];
            break;
        case "knight":
            let leftUp = boardState[pieceRow+2]?.[pieceCol-1];
            let leftDown = boardState[pieceRow-2]?.[pieceCol-1];
            let rightUp = boardState[pieceRow+2]?.[pieceCol+1];
            let rightDown = boardState[pieceRow-2]?.[pieceCol+1];
            let upLeft = boardState[pieceRow+1]?.[pieceCol-2];
            let downLeft = boardState[pieceRow-1]?.[pieceCol-2];
            let upRight = boardState[pieceRow+1]?.[pieceCol+2];
            let downRight = boardState[pieceRow-1]?.[pieceCol+2];
            if(leftUp && (!leftUp.isOccupied || (leftUp.piece.color !== pieceColor && leftUp.piece.type !== "king")))
                possibleSquares = [...possibleSquares, leftUp];
            if(leftDown && (!leftDown.isOccupied || (leftDown.piece.color !== pieceColor && leftDown.piece.type !== "king")))
                possibleSquares = [...possibleSquares, leftDown];    
            if(rightUp && (!rightUp.isOccupied || (rightUp.piece.color !== pieceColor && rightUp.piece.type !== "king")))
                possibleSquares = [...possibleSquares, rightUp];
            if(rightDown && (!rightDown.isOccupied || (rightDown.piece.color !== pieceColor && rightDown.piece.type !== "king")))
                possibleSquares = [...possibleSquares, rightDown];
            if(upLeft && (!upLeft.isOccupied || (upLeft.piece.color !== pieceColor && upLeft.piece.type !== "king")))
                possibleSquares = [...possibleSquares, upLeft];    
            if(downLeft && (!downLeft.isOccupied || (downLeft.piece.color !== pieceColor && downLeft.piece.type !== "king")))
                possibleSquares = [...possibleSquares, downLeft];
            if(upRight && (!upRight.isOccupied || (upRight.piece.color !== pieceColor && upRight.piece.type !== "king")))
                possibleSquares = [...possibleSquares, upRight];    
            if(downRight && (!downRight.isOccupied || (downRight.piece.color !== pieceColor && downRight.piece.type !== "king")))
                possibleSquares = [...possibleSquares, downRight];
            break;
        case "rook":
            possibleSquares = rookMoves(boardState, pieceRow, pieceCol, pieceColor);
            break;
        case "bishop":
            possibleSquares = bishopMoves(boardState, pieceRow, pieceCol, pieceColor);
            break;
    }
    return res.status(200).json({
        possibleSquares: possibleSquares
    });
  }

  function bishopMoves(boardState, pieceRow, pieceCol, pieceColor){
        let possibleSquares = [];
        let x = pieceCol + 1;
        let y = pieceRow + 1;
        while(x<8 && y<8){
            //console.log("increase both");
            let square = boardState[y]?.[x];
            let isSquareOccupied = square?.isOccupied;
            if(!isSquareOccupied){
                possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
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
                possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
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
                possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
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
                possibleSquares = [...possibleSquares, square];
            }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
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
  function rookMoves(boardState, pieceRow, pieceCol, pieceColor){
    let possibleSquares = [];
    let y = pieceRow + 1;
    while(y < 8){
        //console.log("up");
        let square = boardState[y]?.[pieceCol];
        let isSquareOccupied = square?.isOccupied;
        if(!isSquareOccupied){
            possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
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
            possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
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
            possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
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
            possibleSquares = [...possibleSquares, square];
        }else if(isSquareOccupied && (square.piece.color !== pieceColor && square.piece.type !== "king")){
            possibleSquares = [...possibleSquares, square];
            break;
        }else{
            break;
        }
        x--;
    }
    return possibleSquares;
  }