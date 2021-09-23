import Piece from "./piece";

export default function Square (props){
    return (
        <div className="flex-row">
        <div>Row: {props.row}, Col: {props.col}, Color: {props.color}</div>
        {props.isOccupied && <Piece type={props.piece.type} color={props.piece.color}/>}
        </div>
    );
}