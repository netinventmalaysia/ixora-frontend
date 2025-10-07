import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* PWA primary meta tags */}
  <meta name="application-name" content="Ixora MBMB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Ixora MBMB" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#111827" />
        {/* Viewport (lock zoom for app-like UX) */}
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
        />

        {/* Manifest & Icons */}
  <link rel="manifest" href="/manifest.json" />
  {/* iOS Home Screen icons (generated). Primary: 180x180 */}
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  {/* Additional sizes for older devices */}
  <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120.png" />
  <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152.png" />
  <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167.png" />
  {/* Fallback (legacy) */}
  <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="icon" href="/favicon.ico" />
        {/* Leaflet CSS (CDN fallback) */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>
      <body className="antialiased">
        <Main />
        {/* Prevent pinch and double-tap zoom (iOS & some Android) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                let lastTouchEnd=0;document.addEventListener('touchend',function(e){var now=Date.now();if(now-lastTouchEnd<=350){e.preventDefault();}lastTouchEnd=now;}, {passive:false});
                document.addEventListener('gesturestart',function(e){e.preventDefault();}, {passive:false});
                document.addEventListener('gesturechange',function(e){e.preventDefault();}, {passive:false});
                document.addEventListener('gestureend',function(e){e.preventDefault();}, {passive:false});
              })();
            `,
          }}
        />
        <NextScript />
      </body>
    </Html>
  );
}
