import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="KMED Tours Chat with AI offers a safe and efficient way to connect patients and doctors." />
        <meta property="og:title" content="KMED Tours Chat with AI" />
        <meta property="og:description" content="A safe and efficient way to connect patients and doctors." />
        <meta property="og:image" content="https://kmed-tours-chat-service.vercel.app/kmed-logo.png" />
        <meta property="og:url" content="https://kmed-tours-chat-service.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
