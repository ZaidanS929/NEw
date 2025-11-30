import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import GalleryUpload from "@/components/GalleryUpload";

export default function ArticleEditor() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const [, setLocation] = useLocation();
  const articleId = params.id && params.id !== "new" ? parseInt(params.id) : null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("fashion");
  const [featuredImage, setFeaturedImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [published, setPublished] = useState(false);

  const { data: article, isLoading: articleLoading } = trpc.articles.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: false }
  );

  const createMutation = trpc.articles.create.useMutation({
    onSuccess: () => {
      toast.success("Article created successfully");
      setLocation("/admin");
    },
    onError: (error) => {
      toast.error(`Failed to create article: ${error.message}`);
    },
  });

  const updateMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("Article updated successfully");
      setLocation("/admin");
    },
    onError: (error) => {
      toast.error(`Failed to update article: ${error.message}`);
    },
  });

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!articleId) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = (e: React.FormEvent, shouldPublish: boolean) => {
    e.preventDefault();

    if (!title || !slug || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const articleData = {
      title,
      slug,
      content,
      excerpt: excerpt || undefined,
      category,
      featuredImage: featuredImage || undefined,
      galleryImages: galleryImages.length > 0 ? JSON.stringify(galleryImages) : undefined,
      published: shouldPublish,
    };

    if (articleId) {
      updateMutation.mutate({ id: articleId, ...articleData });
    } else {
      createMutation.mutate(articleData);
    }
  };

  if (authLoading || (articleId && articleLoading)) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-4xl font-serif mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-2">
            {articleId ? "Edit Article" : "New Article"}
          </h1>
          <p className="text-muted-foreground">
            {articleId ? "Update your article" : "Create a new article"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Article Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-url-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly version of the title
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="current-events">Current Events</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Image Upload */}
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                label="Featured Image *"
              />

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of the article"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article content here..."
                  rows={15}
                  required
                  className="font-serif"
                />
                <p className="text-xs text-muted-foreground">
                  Supports plain text and basic formatting
                </p>
              </div>

              {/* Gallery Images Upload */}
              <GalleryUpload
                value={galleryImages}
                onChange={setGalleryImages}
                label="Gallery Images (Optional)"
                maxImages={10}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e as any, false)}
                  variant="outline"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e as any, true)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setLocation("/admin")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
