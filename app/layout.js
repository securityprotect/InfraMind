import "./globals.css";

export const metadata = {
  title: "AI Support Assistant",
  description: "Enterprise Troubleshooting Tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
