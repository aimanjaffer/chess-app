import Square from "./square";

export default function Row (props){
    let newRow;
    if(props.playerColor === "black")
        newRow = [...props.squares].reverse();
    else
        newRow = [...props.squares];
    return (
                <div className="grid grid-cols-8 auto-cols-fr">
                    {newRow.map((square, index)=> <Square key={"("+square.row+","+square.col+")"} 
                    row={square.row} 
                    col={square.col} 
                    color={square.color} 
                    isOccupied={square.isOccupied} 
                    piece = {square.piece}
                    pieceTouched= {props.pieceTouched}
                    emptySquareTouched={props.emptySquareTouched}
                    highlighted={props.highlightedSquares.filter((highlightedSquare) => (highlightedSquare.row === square.row) && (highlightedSquare.col === square.col)
                    ).length > 0}
                    />)}
                </div>
    );
}