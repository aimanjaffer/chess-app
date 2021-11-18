import Image from 'next/image';
export default function Piece (props){
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
    <div className="text-center cursor-pointer" onClick={() => props.pieceTouched(props.color, props.type, props.row, props.col, props.hasMoved)}>
        <Image src={iconpath} alt="me" width="80" height="80" />
    </div>
    );
}