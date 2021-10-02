import Head from 'next/head'
import Game from '../components/game';
import Login from '../components/login';
import { getSession, useSession } from "next-auth/client"
import { signOut } from "next-auth/client";
import AvailableUsers from '../components/available-users';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { initialBoardState } from "../providers/game-context";
export default function Home() {
  const [session] = useSession();
  if(!session)
    return <Login/>;

  const [notifications, setNotifications] = useState([]);
  const [gameId, setGameId] = useState();
  const [playerColor, setPlayerColor] = useState("");
  const [boardState, setBoardState] = useState(initialBoardState);
  const [turn, setTurn] = useState("white");
  const [userEmails, setUserEmails] = useState([]);
  const [socket, setSocket] = useState(null);
  let newNotificationId = 0;
  
  useEffect(()=>{
    const newSocket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
        reconnectionDelayMax: 10000        
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if(socket != null){
      socket.on("connect", () => {
        //console.log(socket.id," connected");
        socket.emit("get-available-players");
      });
      socket.emit("register-client", {
        email: session.user.email
      });
      socket.on("new-challenge-received", (message)=> {
        newNotificationId += 1;
        let newNotification = {
          id: newNotificationId,
          sender: message.sender
        };
        setNotifications((notifications)=>{
          return [...notifications, newNotification];
        });
      });
      socket.on("new-game-created", (message) => {
        setPlayerColor(message.playerColor);
        setGameId(message.gameId);
      });
      socket.on("new-game-request-rejected", (message) => {
        console.log("Request rejected by: ", message.responder);
      });
      socket.on("opponentMovedPiece", (message)=>{
        //console.log("opponent moved piece");
        setBoardState(message.boardState);
        setTurn(message.turn);
    });
    socket.on("available-players-received", (message) => {
        let result = message.emails.filter((email) => email !== session.user.email);
        setUserEmails(result);
    });
    }
  },[socket]);

  function signOutHandler(){
    if(socket != null)
      socket.close();
    signOut();
  }

  function challengeHandler(state, challengeSender){
    if(socket != null){
      switch(state){
        case "accept":
          console.log("accepting challenge from: ", challengeSender);
          let messageBody = {
            responder: session.user.email,
            challengeSender
          };
          const requestOptions = {
            method: "POST",
            body: JSON.stringify(messageBody)
          };
          fetch('/api/createGame', requestOptions)
          .then(response => response.json())
          .then(response => {
            console.log(response.gameId);
            socket.emit("challenge-accepted", {...messageBody, gameId: response.gameId, playerColor: response.playerColor});
            setPlayerColor(response.playerColor);
            setGameId(response.gameId);
          });          
          break;
        case "reject":
          console.log("rejecting challenge from: ", challengeSender);
          socket.emit("challenge-rejected", {
            responder: session.user.email,
            challengeSender
          });
          break;
      }
    }
  }
  function setTurnAndBoardState(turn, boardState){
    setTurn(turn);
    setBoardState(boardState);
  }

  return (
    <>
      <Head>
        <title>Chess App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Welcome, {session.user.name}
      You are logged in using: {session.user.email}
      {notifications &&
       <ul>
         {notifications.map((notification) => {
           return (
           <li key={notification.id}>
            <p>New challenge received from: {notification.sender}</p>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={()=> challengeHandler("accept", notification.sender)}>Accept</button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={()=> challengeHandler("reject", notification.sender)}>Reject</button>
           </li>);
         })}
      </ul>
      }
      {!gameId && <AvailableUsers session={session} socket={socket} userEmails={userEmails}/>}
      {gameId && <Game socket={socket} 
      gameId={gameId} 
      playerColor={playerColor}
      boardState={boardState}
      turn={turn}
      setTurnAndBoardState={setTurnAndBoardState}/>} 
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={signOutHandler}>Sign out</button>    
     </>
  );
}
export async function getServerSideProps(context){
  const session = await getSession(context);
  return {
    props:{
      session,
    },
  };
}
