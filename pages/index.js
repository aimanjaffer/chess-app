import Head from 'next/head'
import Game from '../components/game'
export default function Home() {
  return (
    <>
      <Head>
        <title>Chess App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Game/>
          
     </>
  )
}
