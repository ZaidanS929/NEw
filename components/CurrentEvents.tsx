import Layout from "@/components/Layout";

export default function CurrentEvents() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-widest mb-8 text-foreground">
          Current Events
        </h1>
        <div className="w-16 h-px bg-primary mb-8"></div>
        
        <div className="max-w-lg mx-auto p-12 border border-border bg-card shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          
          <p className="font-serif text-xl italic text-muted-foreground mb-8">
            "Stay informed on the stories shaping our world today."
          </p>
          
          <p className="text-sm font-bold tracking-widest uppercase text-foreground/50">
            No articles available at this time.
          </p>
        </div>
      </div>
    </Layout>
  );
}
