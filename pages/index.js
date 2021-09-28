import Head from 'next/head'
import Game from '../components/game';
import Login from '../components/login';
import { getSession, useSession } from "next-auth/client"
import { signOut } from "next-auth/client";
import AvailableUsers from '../components/available-users';
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
export default function Home() {
  const [session] = useSession();
  if(!session)
    return <Login/>;
  const [notifications, setNotifications] = useState([]);
  let newNotificationId = 0;
  const [socket, setSocket] = useState(null);
  useEffect(()=>{
    const newSocket = io("ws://localhost:3001", {
        reconnectionDelayMax: 10000        
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(()=>{
    if(socket != null){
      socket.emit("register-client", {
        email: session.user.email
      });
      socket.on("new-challenge-received", (message)=>{
        newNotificationId += 1;
        let newNotification = {
          id: newNotificationId,
          sender: message.sender
        };
        setNotifications((notifications)=>{
          return [...notifications, newNotification];
        });
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
          /*
          make an API call to the server to start a new game 
          Server sends back the new game ID
          Send that game ID as part of the websocket emit, 
          update game ID to the value received from the server and pass the game ID as a prop to Game Component
          */
          socket.emit("challenge-accepted", {
            responder: session.user.email,
            challengeSender
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
            <button onClick={()=> challengeHandler("accept", notification.sender)}>Accept</button>
            <button onClick={()=> challengeHandler("reject", notification.sender)}>Reject</button>
           </li>);
         })}
      </ul>
      }
      <AvailableUsers session={session} socket={socket}/> {/*TODO: Show this only if user has no game ongoing */}
      <Game socket={socket}/> {/*TODO: Show this only if game is created and ongoing */}
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={signOutHandler}>Sign out</button>    
     </>
  )
}
export async function getServerSideProps(context){
  const session = await getSession(context);
  return {
    props:{
      session,
    },
  };
}
