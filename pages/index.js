import Head from 'next/head'
import Game from '../components/game'
export default function Home() {
  return (
    <>
      <Head>
        <title>Chess App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto border-8 border-black">
      <Game/>
      </div>     
     </>
  )
}
