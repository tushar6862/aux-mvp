import { Inter } from 'next/font/google';
import '../assets/css/global.css';
import Providers from '@/provider/Providers';
import { METADATA } from '@/utils/constant/constant.helper';

export const inter = Inter({
  weight: '400',
  subsets: ['latin'],
});
//
export const metadata = {
  title: METADATA.APP_NAME,
  applicationName: METADATA.APP_NAME,
  description: METADATA.APP_DESCRIPTION,
};
export const generateViewport = () => ({
  width: 'device-width',
  initialScale: 1,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <section className="mainWrapper bg-image">
          <Providers>{children}</Providers>
        </section>
      </body>
    </html>
  );
}
