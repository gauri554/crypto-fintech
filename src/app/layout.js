import { CRMProvider } from "@/context/CRMContext";

export const metadata = {
  title: "🛡️ Enterprise Risk Management CRM",
  description: "Next.js AI-Driven Crypto Triage Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0f172a", color: "#f8fafc" }}>
        
        {/* 💡 WE WRAP the entire application tree inside our CRM Data Vault Provider */}
        <CRMProvider>
          {children}
        </CRMProvider>
        
      </body>
    </html>
  );
}
