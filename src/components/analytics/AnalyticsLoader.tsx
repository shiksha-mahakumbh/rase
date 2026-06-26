"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_ACCEPTED_EVENT,
  COOKIE_WITHDRAWN_EVENT,
  hasAnalyticsConsent,
} from "@/lib/cookie-consent";
import {
  applyConsentDenied,
  applyConsentGranted,
  CONSENT_DEFAULT_SCRIPT,
} from "@/lib/analytics/consent-mode";

export default function AnalyticsLoader() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const ok = hasAnalyticsConsent();
      setEnabled(ok);
      if (ok) applyConsentGranted();
      else applyConsentDenied();
    };
    sync();
    window.addEventListener(COOKIE_ACCEPTED_EVENT, sync);
    window.addEventListener(COOKIE_WITHDRAWN_EVENT, sync);
    return () => {
      window.removeEventListener(COOKIE_ACCEPTED_EVENT, sync);
      window.removeEventListener(COOKIE_WITHDRAWN_EVENT, sync);
    };
  }, []);

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      <Script id="consent-mode-default" strategy="afterInteractive">
        {CONSENT_DEFAULT_SCRIPT}
      </Script>

      {enabled ? (
        <>
          {gtmId ? (
            <>
              <Script id="gtm-init" strategy="lazyOnload">{`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `}</Script>
              <noscript>
                <iframe
                  title="Google Tag Manager"
                  src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                  height="0"
                  width="0"
                  style={{ display: "none", visibility: "hidden" }}
                />
              </noscript>
            </>
          ) : null}

          {!gtmId && gaId ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="lazyOnload"
              />
              <Script id="ga4-init" strategy="lazyOnload">{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}</Script>
            </>
          ) : null}

          {clarityId ? (
            <Script id="clarity-init" strategy="lazyOnload">{`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}</Script>
          ) : null}

          {metaPixelId ? (
            <Script id="meta-pixel" strategy="lazyOnload">{`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}</Script>
          ) : null}
        </>
      ) : null}
    </>
  );
}
