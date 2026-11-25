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
      {/* Conversiones: clics en WhatsApp, agenda, correo y teléfono como eventos de GA4 (generate_lead). */}
      <Script id="ga-leads" strategy="lazyOnload">
        {`document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||typeof gtag!=='function')return;var h=a.getAttribute('href')||'',m=null;if(/wa\\.me|wa\\.link|api\\.whatsapp|web\\.whatsapp/i.test(h))m='whatsapp';else if(/calendar\\.app\\.google|calendar\\.google|#agenda/i.test(h))m='agenda';else if(/^mailto:/i.test(h))m='email';else if(/^tel:/i.test(h))m='telefono';else if(/\\/contacto\\/|\\/en\\/contact\\//.test(h))m='contacto';if(!m)return;gtag('event','generate_lead',{method:m,link_url:h,page_path:location.pathname});gtag('event','clic_'+m,{page_path:location.pathname});},true);`}
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
