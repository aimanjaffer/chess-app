import { v4 as uuidv4 } from 'uuid';
export default function createGameAPI(req, res) {
    //console.log(req.body);
    let playerColor = (Math.floor(Math.random() * 2) === 0) ? "black" : "white";
    res.status(200).json({ 
        gameId : uuidv4(),
        playerColor
     });
  }