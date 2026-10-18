import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import { AuthProvider } from "@/lib/auth/provider"
import { PreviewHostBridge } from "@/components/preview-host-bridge"
import appCss from "../styles.css?url"

const APP_NAME = "Mango Moon"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "description", content: "Grow a Jamaican cove, press jam with Granny Marva, and age fruit wine in the dark." },
      { name: "theme-color", content: "#14302e" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/icons/icon-192.png?v=tree" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png?v=tree" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
})
