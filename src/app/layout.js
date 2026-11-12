// app/layout.tsx or app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SocketProvider } from "@/Contexts/SocketContexts";
import { Suspense } from "react";
import { ThemeProvider } from "@/Contexts/Themecontext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MCQLive — Live MCQ tests with real-time results",
  description:
    "Create live multiple-choice tests, share a room code, and watch answers, scores and leaderboards update in real time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SocketProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Suspense>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </SocketProvider>
      </body>
    </html>
  );
}
