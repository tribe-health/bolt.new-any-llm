import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { useStore } from '@nanostores/react';
import { themeStore } from '~/lib/stores/theme';
import { ToastContainer } from 'react-toastify';
import { Provider as TooltipProvider } from '@radix-ui/react-tooltip';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';

export default function App() {
  const theme = useStore(themeStore);

  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/app_icon.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <TooltipProvider>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
