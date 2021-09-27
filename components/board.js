import Row from "./row";

export default function Board (props){
    let newArray;
    if(props.playerColor === "white")
        newArray = [...props.boardState].reverse();
    else
        newArray = [...props.boardState];
    return (
    <div className="grid grid-row-8 auto-rows-fr">
    {newArray.map((row,index)=> <Row key={props.playerColor === "white" ? 7-index : index}  squares={row} 
    rowNumber={props.playerColor === "white" ? 7-index : index} 
    pieceTouched={props.pieceTouched}
    emptySquareTouched={props.emptySquareTouched}
    playerColor={props.playerColor}
    />)}
    </div>
    );
}