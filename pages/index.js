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
  const [rejections, setRejections] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [gameId, setGameId] = useState();
  const [playerColor, setPlayerColor] = useState("");
  const [boardState, setBoardState] = useState(initialBoardState);
  const [turn, setTurn] = useState("white");
  const [userEmails, setUserEmails] = useState([]);
  const [socket, setSocket] = useState(null);
  let newNotificationId = 0;
  let newRejectionId = 0;
  useEffect(()=>{
    const newSocket = io("https://sleepy-cliffs-05801.herokuapp.com", {
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
        setNotifications((notifications) => {
          return [...notifications, newNotification];
        });
      });
      socket.on("new-game-created", (message) => {
        setPlayerColor(message.playerColor);
        setGameId(message.gameId);
      });
      socket.on("new-game-request-rejected", (message) => {
        newRejectionId += 1;
        let rejectionMessage = "Game Request rejected by: " + message.responder;
        let rejection = {
          id: newRejectionId,
          message: rejectionMessage
        }
        setRejections(rejections => {
          return [...rejections, rejection];
        })
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

  function challengeHandler(state, challengeSender, notificationId){
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
      setNotifications((notifications) => {
        return notifications.filter(notification => notification.id !== notificationId);
      });
    }
  }
  function setTurnAndBoardState(turn, boardState){
    setTurn(turn);
    setBoardState(boardState);
  }
  function clearNotifications(){
    setRejections([]);
  }

  return (
    <>
      <Head>
        <title>Chess App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-600 rounded-lg p-2 m-2">
        <h1 className="text-xl text-white">Welcome, {session.user.name}</h1>
        <h2 className="text-lg text-white">You are logged in using: {session.user.email}</h2>
      </div>
      {rejections.length>0 && 
      <div className="bg-gray-600 rounded-lg p-2 m-2">
      <ul>
         {rejections.map((rejection) => {
           return (
           <li className="p-2 hover:bg-gray-500 rounded" key={rejection.id}>
            <p style={{color:"red", fontStyle:"italic"}}>{rejection.message}</p>
           </li>);
         })}
      </ul>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={clearNotifications}>Clear Notifications</button>
      </div>
      }
      {notifications.length>0 &&
      <div className="bg-gray-600 rounded-lg p-2 m-2">
        <ul>
          {notifications.map((notification) => {
            return (
            <li className="p-2 hover:bg-gray-500 rounded" key={notification.id}>
              <p className="inline pr-2 text-white">New challenge received from: {notification.sender}</p>
              <button className="mr-2 bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => challengeHandler("accept", notification.sender, notification.id)}>Accept</button>
              <button className="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded" onClick={() => challengeHandler("reject", notification.sender, notification.id)}>Reject</button>
            </li>);
          })}
        </ul>
      </div>
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
