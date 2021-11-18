import {signIn} from "next-auth/client";
function Login(){
    return (
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={signIn}>Get Started</button>
            <p className="text-white italic">You can sign-in using your Google Account or by providing any unique username.</p>
        </div>
    );
}
export default Login;