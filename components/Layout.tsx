import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "FASHION", path: "/fashion" },
    { name: "CURRENT EVENTS", path: "/current-events" },
    { name: "ABOUT", path: "/about" },
    ...(user && user.role === 'admin' ? [{ name: "ADMIN", path: "/admin" }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-6">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-4xl md:text-6xl font-serif tracking-widest uppercase hover:text-primary transition-colors cursor-pointer text-center">
              THE BIRDS IN ROUGE
            </h1>
          </Link>
          
          {/* Navigation */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center border-t border-border pt-4 mt-2">
            <nav className="flex flex-wrap justify-center gap-8 md:gap-12 mx-auto">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span 
                    className={cn(
                      "text-xs md:text-sm font-bold tracking-[0.2em] hover:text-primary transition-all cursor-pointer relative group py-2",
                      location === item.path ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                    <span className={cn(
                      "absolute bottom-0 left-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0",
                      location === item.path ? "w-full left-0" : ""
                    )}></span>
                  </span>
                </Link>
              ))}
            </nav>
            
            <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2">
               <button className="text-xs font-bold tracking-widest border border-foreground px-6 py-2 hover:bg-foreground hover:text-background transition-colors uppercase">
                 Login
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-md">
            <h2 className="text-2xl font-serif mb-6 uppercase tracking-wider">Stay Informed</h2>
            <p className="mb-8 text-muted-foreground font-light leading-relaxed">
              Receive our latest stories on fashion and current events directly to your inbox.
            </p>
            <div className="flex border-b border-muted-foreground/30 pb-2">
              <input 
                type="email" 
                placeholder="Your Email Address" 
                className="bg-transparent border-none px-0 py-2 w-full focus:ring-0 focus:outline-none text-secondary-foreground placeholder:text-muted-foreground/50 font-light"
              />
              <button className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 text-right">
            <h3 className="text-lg font-serif uppercase mb-2 tracking-widest">Menu</h3>
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer uppercase tracking-widest transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground uppercase tracking-[0.2em]">
          © 2025 The Birds in Rouge. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
