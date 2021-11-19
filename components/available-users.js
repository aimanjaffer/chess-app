function AvailableUsers(props){

    function sendChallenge(email){
        console.log("sending challenge to: ", email);
        if(props.socket != null){
            props.socket.emit("new-challenge", {
                sender: props.session.user.email,
                recepient: email
            });
        }
    }
    return (
    <div>
    {props.userEmails.length > 0 ? 
    <div className="bg-black rounded-lg p-2 m-2">
    <h1 className="text-xl font-semibold text-white">List of Available Users: </h1>
    <ul>
        {props.userEmails.map((email)=>{
            return(
            <li className="hover:bg-gray-900 rounded" key={email}>
                <p className="inline p-2 text-white">{email}</p>
                <button onClick={() => sendChallenge(email)} className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">Send Challenge</button>
            </li>
            );
        })}
    </ul>
    </div> : <div className="bg-black rounded-lg p-2 m-2">
            <h1 className="text-xl italic font-semibold text-white">There are no other users online at the moment.</h1>
            <h2 className="text-lg italic font-medium text-white">If you would like to test out the app's functionality, please open a new instance of the app in a separate incognito window and sign in with a different Username or Google account.</h2>
          </div>
    }
    </div>
    );
}
export default AvailableUsers;