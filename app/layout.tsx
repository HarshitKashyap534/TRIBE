import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import ClientRootLayout from "./clientLayout"
import Script from "next/script"
import { GA_TRACKING_ID } from "@/lib/gtag"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tribe",
  description: "Connect and Share with your University Network",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
        {/* End Google Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent image downloading
              document.addEventListener('DOMContentLoaded', function() {
                // Disable right-click on images
                document.addEventListener('contextmenu', function(e) {
                  if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Disable drag and drop on images
                document.addEventListener('dragstart', function(e) {
                  if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Disable keyboard shortcuts for images
                document.addEventListener('keydown', function(e) {
                  // Prevent Ctrl+S, Ctrl+Shift+S, F12, Ctrl+U, Ctrl+Shift+I
                  if (
                    (e.ctrlKey && e.key === 's') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'S') ||
                    e.key === 'F12' ||
                    (e.ctrlKey && e.key === 'u') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I')
                  ) {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Disable selection on images
                document.addEventListener('selectstart', function(e) {
                  if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Additional protection for dynamically added images
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.tagName === 'IMG') {
                          node.style.userSelect = 'none';
                          node.style.webkitUserSelect = 'none';
                          node.style.mozUserSelect = 'none';
                          node.style.msUserSelect = 'none';
                          node.style.pointerEvents = 'none';
                        }
                      });
                    }
                  });
                });
                
                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  )
}
