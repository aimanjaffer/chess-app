import 'tailwindcss/tailwind.css'
import { Provider } from "next-auth/client";
function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-cover" style={{backgroundImage: "url(/wallpaper.jpg)"}}>
    <div className="flex flex-row justify-center mt-4 mb-6">
        <div className="font-serif text-7xl text-white">Chess App</div>
    </div>
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
    </div>
  );
}

export default MyApp;
