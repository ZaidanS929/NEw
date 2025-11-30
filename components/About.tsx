import Layout from "@/components/Layout";
import { Link } from "wouter";

export default function About() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
        <div className="text-[12rem] font-serif font-bold leading-none text-foreground/5 select-none absolute z-0">
          404
        </div>

        <div className="relative z-10 max-w-md mx-auto bg-background/80 backdrop-blur-sm p-8 border border-border shadow-2xl">
          <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mx-auto mb-6 text-primary text-xl font-serif italic">
            !
          </div>
          
          <h1 className="text-3xl font-serif uppercase tracking-widest mb-4 text-foreground">Page Not Found</h1>
          
          <p className="font-light text-muted-foreground mb-8 leading-relaxed">
            The page you are looking for has vanished into the shadows. It may have been moved or deleted.
          </p>
          
          <Link href="/">
            <button className="text-xs font-bold tracking-[0.2em] border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-all uppercase">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
