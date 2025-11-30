import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useParams } from "wouter";
import SlidingGallery from "@/components/SlidingGallery";

export default function Article() {
  const params = useParams();
  const slug = params.slug || "";

  const { data: article, isLoading, error } = trpc.articles.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-4xl font-serif mb-4">Article Not Found</h1>
          <p className="text-muted-foreground">The article you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  // Parse gallery images from JSON string
  const galleryImages = article.galleryImages
    ? JSON.parse(article.galleryImages)
    : [];

  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <header className="mb-16 text-center">
          <div className="text-xs font-bold tracking-[0.2em] text-primary mb-6 uppercase">
            <span>{article.category}</span>
            {" · "}
            <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-8 text-foreground">
            {article.title}
          </h1>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-16 shadow-2xl">
            <img 
              src={article.featuredImage} 
              alt={article.title} 
              className="w-full h-auto"
            />
            <div className="mt-4 text-xs text-center font-serif italic text-muted-foreground">
              Fig 1.0: {article.title}
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none font-serif prose-headings:font-serif prose-headings:font-normal prose-p:font-light prose-p:leading-loose prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:border-primary">
          {article.content.split('\n\n').map((paragraph, index) => {
            // Check if paragraph is a heading (starts with **)
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              const headingText = paragraph.slice(2, -2);
              return (
                <h2
                  key={index}
                  className="text-2xl md:text-3xl font-serif font-bold mt-12 mb-6 text-foreground"
                >
                  {headingText}
                </h2>
              );
            }
            
            // First paragraph with drop cap
            if (index === 0) {
              return (
                <p key={index} className="lead text-2xl leading-relaxed mb-12 first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:leading-none text-foreground">
                  {paragraph}
                </p>
              );
            }
            
            // Regular paragraphs
            return (
              <p key={index} className="mb-8 text-foreground/90">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Static Gallery Section at Bottom */}
        {galleryImages.length > 0 && (
          <div className="mt-24 pt-12 border-t border-border">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-[3/4] overflow-hidden bg-muted shadow-lg"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Footer */}
        <footer className="mt-24 pt-12 border-t border-border text-center">
          <p className="text-sm font-serif italic text-muted-foreground">
            End of article.
          </p>
        </footer>
      </article>

      {/* Sliding Gallery Component */}
      {galleryImages.length > 0 && <SlidingGallery images={galleryImages} />}
    </Layout>
  );
}
