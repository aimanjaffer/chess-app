import {signIn} from "next-auth/client";
function Login(){
    return (
        <div className="flex h-screen justify-center items-center">
            <div className="text-center"> 
                <button className="bg-green-700 hover:bg-green-500 text-white text-3xl font-bold py-2 px-4 rounded" onClick={signIn}>Get Started</button>
                <p className="text-white text-xl italic bg-black rounded-lg py-2 px-4">You can sign-in using your Google Account or by providing any unique username.</p>
            </div>
        </div>
    );
}
export default Login;