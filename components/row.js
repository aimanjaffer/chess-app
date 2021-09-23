import Square from "./square";

export default function Row (props){
    return (
                <div className="grid grid-cols-8 auto-cols-fr">
                    {props.squares.map((square, index)=> <Square key={"("+props.rowNumber+","+index+")"} 
                    row={props.rowNumber} 
                    col={index} 
                    color={square.color} 
                    isOccupied={square.isOccupied} 
                    piece = {square.piece}
                    pieceTouched= {props.pieceTouched}
                    emptySquareTouched={props.emptySquareTouched}
                    />)}
                </div>
    );
}