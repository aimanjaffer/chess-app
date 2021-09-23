import Row from "./row";

export default function Board (props){
    return (
    <>
    {props.boardState.map((row,index)=> <Row key={index}  squares={row} rowNumber={index}/>)}
    </>
    );
}