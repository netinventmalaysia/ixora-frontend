import "todo/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'rounded-md bg-white px-4 py-3 shadow text-sm text-gray-800 border border-gray-200',
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ecfdf5',
            },
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}