import Piece from "./piece";

export default function Square (props){
    let color = props.color === "black" ? "bg-yellow-900" : "bg-yellow-100";
    function squareClicked(){
        console.log(props.color+ " square at ("+props.row+","+props.col+") was clicked")
    }
    return (
        <div onClick={squareClicked} className={"h-full w-full " + color}>
            {props.isOccupied && <Piece type={props.piece.type} color={props.piece.color} row={props.row} col={props.col}/>}
        </div>
    );
}