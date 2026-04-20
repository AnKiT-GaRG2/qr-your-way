import { QRGenerator } from "@/components/QRGenerator";
import { QrCode, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background bg-mesh">
      <header className="border-b border-border/40 backdrop-blur-md bg-background/60 sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
              <QrCode className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="font-display font-bold text-lg tracking-tight">
              QR Forge
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary/60 border border-border/60">
            <Sparkles className="w-3 h-3 text-primary" />
            Free • No sign-up
          </div>
        </div>
      </header>

      <main className="container py-10 md:py-16">
        <section className="text-center max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Custom QR codes in seconds
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
            Create stunning QR codes
            <br />
            <span className="text-gradient">with your logo</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Turn any URL, WiFi network, email, or message into a beautiful, branded QR code. Pick a style, drop in your logo, and download.
          </p>
        </section>

        <QRGenerator />

        <footer className="mt-20 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          Built with ❤️ — Scan responsibly.
        </footer>
      </main>
    </div>
  );
};

export default Index;
