import Row from "./row";

export default function Board (props){
    return (
    <div className="grid grid-row-8 auto-rows-fr">
    {props.boardState.map((row,index)=> <Row key={index}  squares={row} rowNumber={index}/>)}
    </div>
    );
}