import Script from 'next/script'
import { tracking } from '@/lib/site'

/** Agente de chat de PushLeads: se carga también en desarrollo para poder verlo en local. */
const ChatAgent = () => <Script src="https://pushleads.co/api/widget" data-agent-id={tracking.pushleadsAgent} strategy="lazyOnload" />

/** Analítica (solo en producción) y chat, sin bloquear el render. */
export function Integrations() {
  if (process.env.NODE_ENV !== 'production') return <ChatAgent />
  const [primaryGa] = tracking.ga

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${primaryGa}`} strategy="lazyOnload" />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${tracking.ga
          .map((id) => `gtag('config','${id}');`)
          .join('')}`}
      </Script>
      <Script id="clarity-init" strategy="lazyOnload">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${tracking.clarity}");`}
      </Script>
      <Script id="fb-pixel" strategy="lazyOnload">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tracking.facebookPixel}');fbq('track','PageView');`}
      </Script>
      <ChatAgent />
    </>
  )
}
