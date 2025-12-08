import { GeistSans } from 'geist/font/sans';
import '../globals.css';

export const metadata = {
  title: 'Chat Widget',
  description: 'Embeddable chat widget',
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className={`${GeistSans.className} bg-transparent`}>
        {children}
      </body>
    </html>
  );
}

