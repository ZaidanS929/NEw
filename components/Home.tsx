import { useAuth } from "@/_core/hooks/useAuth";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  // Authentication state (for future use if needed)
  const { user, loading, error, isAuthenticated, logout } = useAuth();

  // Fetch published articles
  const { data: articles, isLoading } = trpc.articles.list.useQuery({
    publishedOnly: true,
  });

  // Get the most recent article
  const featuredArticle = articles && articles.length > 0 ? articles[0] : null;

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : featuredArticle ? (
        <>
          {/* Hero Section - Featured Article */}
          <section className="max-w-5xl mx-auto mb-24">
            <div className="text-center mb-12">
              <div className="text-xs font-bold tracking-[0.2em] text-primary mb-4 uppercase">
                {featuredArticle.category} · {new Date(featuredArticle.publishedAt || featuredArticle.createdAt).toLocaleDateString()}
              </div>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8 hover:text-primary transition-colors duration-500 cursor-pointer">
                <Link href={`/article/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>
            </div>

            <div className="relative group cursor-pointer mb-12">
              <Link href={`/article/${featuredArticle.slug}`}>
                <div className="aspect-[3/4] md:aspect-[16/9] overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                  <img 
                    src={featuredArticle.featuredImage || "/assets/original_hero.jpeg"} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                </div>
              </Link>
            </div>

            <div className="text-center max-w-2xl mx-auto">
              {featuredArticle.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-8">
                  {featuredArticle.excerpt}
                </p>
              )}
              <Link href={`/article/${featuredArticle.slug}`}>
                <button className="text-xs font-bold tracking-[0.2em] border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-all uppercase">
                  Read Full Story
                </button>
              </Link>
            </div>
          </section>

          {/* Additional Articles if any */}
          {articles && articles.length > 1 && (
            <section className="border-t border-border pt-16">
              <h3 className="text-2xl font-serif text-center mb-12 uppercase tracking-widest">More Stories</h3>
              <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {articles.slice(1, 5).map((article) => (
                  <Link key={article.id} href={`/article/${article.slug}`}>
                    <div className="group cursor-pointer">
                      {article.featuredImage && (
                        <div className="aspect-video overflow-hidden mb-4 shadow-lg">
                          <img 
                            src={article.featuredImage} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="text-xs font-bold tracking-[0.2em] text-primary mb-2 uppercase">
                        {article.category}
                      </div>
                      <h4 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      {article.excerpt && (
                        <p className="text-muted-foreground font-light line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="border-t border-border pt-16 text-center">
          <p className="text-sm font-serif italic text-muted-foreground">
            No articles published yet.
          </p>
        </section>
      )}
    </Layout>
  );
}
