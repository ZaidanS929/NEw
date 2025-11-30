import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Fashion() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery({
    category: "fashion",
    publishedOnly: true,
  });

  return (
    <Layout>
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-serif uppercase tracking-widest mb-6 text-foreground">
          Fashion <span className="text-primary italic">Archives</span>
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        <p className="text-xl font-light text-muted-foreground max-w-2xl mx-auto font-serif italic">
          "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street, fashion has to do with ideas, the way we live, what is happening."
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : articles && articles.length > 0 ? (
          <>
            {articles.map((article, index) => (
              <div key={article.id} className="group cursor-pointer mb-16">
                <Link href={`/article/${article.slug}`}>
                  <div className={`${index === 0 ? 'aspect-[3/4] md:aspect-[2/3]' : 'aspect-video'} overflow-hidden relative shadow-2xl mb-8 ${index === 0 ? 'max-w-2xl mx-auto' : ''}`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img 
                      src={article.featuredImage || "/assets/original_hero.jpeg"} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold tracking-[0.2em] text-primary mb-4 uppercase">
                      {index === 0 ? 'Featured Story' : 'Fashion'}
                    </div>
                    <h2 className={`${index === 0 ? 'text-3xl md:text-5xl' : 'text-2xl md:text-4xl'} font-serif leading-tight mb-4 text-foreground group-hover:text-primary transition-colors`}>
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center border-t border-border pt-16">
            <p className="text-sm font-serif italic text-muted-foreground">
              No fashion articles available at this time.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
