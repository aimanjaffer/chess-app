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
    <>
    <h1>List of Available Users: </h1>
    <ul>
        {props.userEmails.map((email)=>{
            return(
            <li key={email}>
                <p>{email}</p>
                <button onClick={() => sendChallenge(email)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Send Challenge</button>
            </li>
            );
        })}
    </ul>
    </>
    );
}
export default AvailableUsers;