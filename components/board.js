import Row from "./row";

export default function Board (props){
    //TODO: change how the board is displayed based on player color
    const newArray = [...props.boardState].reverse();
    return (
    <div className="grid grid-row-8 auto-rows-fr">
    {newArray.map((row,index)=> <Row key={7-index}  squares={row} 
    rowNumber={7-index} 
    pieceTouched={props.pieceTouched}
    emptySquareTouched={props.emptySquareTouched}
    />)}
    </div>
    );
}