import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="KMED Tours Chat with AI provides a new way to tour while using medical examinations, oriental clinics, and dental clinics in Korea." />
        <meta property="og:title" content="KMED Tours Chat with AI" />
        <meta property="og:description" content="A new way to tour while using medical examinations, oriental clinics, and dental clinics in Korea." />
        <meta property="og:image" content="https://kmed-tours-chat-service.vercel.app/kmed-logo.png" />
        <meta property="og:url" content="https://kmed-tours-chat-service.vercel.app/" />
        <meta name="twitter:image" content="https://kmed-tours-chat-service.vercel.app/kmed-logo.png" />
        <meta name="twitter:title" content="KMED Tours Chat with AI" />
        <meta name="twitter:description" content="A new way to tour while using medical examinations, oriental clinics, and dental clinics in Korea." />
        <title>KMED Tours Chat with AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
