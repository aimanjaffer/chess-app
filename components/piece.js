import Image from 'next/image';
export default function Piece (props){
    function pieceClicked(color, type, row, col){
        console.log(color + " "+ type + " was clicked at: ("+ row+","+col+")");
    }
    let iconpath ="/icons/";
    props.color === "black" ? iconpath += "b" : iconpath+="w";
    switch(props.type){
        case "pawn":
            iconpath +="p.png";
            break;
        case "king":
            iconpath +="k.png";
            break;
        case "queen":
            iconpath +="q.png";
            break;
        case "knight":
            iconpath +="n.png";
            break;
        case "rook":
            iconpath +="r.png";
            break;
        case "bishop":
            iconpath +="b.png";
            break;
    } 
    return (
    <div className="text-center" onClick={() => pieceClicked(props.color, props.type, props.row, props.col)}>
        <Image src={iconpath} alt="me" width="64" height="64" />
    </div>
    );
}