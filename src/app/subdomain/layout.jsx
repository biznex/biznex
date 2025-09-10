// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}