import { db } from '../firebase';
import { useEffect, useState } from 'react';
function AvailableUsers(props){
    const [userEmails, setUserEmails] = useState([]);
    useEffect(() => {
        if(props.socket != null){
            props.socket.emit("get-available-players");
            props.socket.on("available-players-received", (message) => {
                let result = message.emails.filter((email) => email !== props.session.user.email);
                setUserEmails(result);
            });
        }
    }, [props.socket]);

    function sendChallenge(email){
        console.log("sending challenge to: ", email);
        if(props.socket != null){
            props.socket.emit("new-challenge", {
                sender: props.session.user.email,
                recepient: email
            });
        }
    }
/*
    async function fetchActiveUsersFromSession(){
        const sessions = db.collection('sessions');
        const sessionsData = await sessions.get();
        sessionsData.docs.forEach((session)=>{
            const user = db.doc(`users/${session.data().userId}`);
            user.get().then((userData)=>{
                if(userData.data().email !== props.session.user.email){
                    setUserEmails((userEmails)=>{
                        if(userEmails.includes(userData.data().email))
                            return userEmails;
                        return [...userEmails, userData.data().email];
                    });
                }   
            });
        });
    }
*/
    return (
    <>
    <h1>List of Available Users: </h1>
    <ul>
        {userEmails.map((email)=>{
            return(<li key={email}>
                    <p>{email}</p>
                    <button onClick={() => sendChallenge(email)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Send Challenge</button>
                </li>);
        })}
    </ul>
    </>
    );
}
export default AvailableUsers;