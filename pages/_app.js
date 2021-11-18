import 'tailwindcss/tailwind.css'
import { Provider } from "next-auth/client";
import { useEffect } from 'react';
function MyApp({ Component, pageProps }) {
  useEffect( () => { 
    let body = document.querySelector("body");
    body.className= "bg-gray-700";
  } );
  return (
    <>
    <div className="flex flex-row justify-center mt-4 mb-6">
        <div className="font-serif text-7xl text-white">Chess App</div>
    </div>
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
    </>
  );
}

export default MyApp;
