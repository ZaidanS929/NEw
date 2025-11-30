import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus } from "lucide-react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: articles, isLoading, refetch } = trpc.articles.list.useQuery({
    publishedOnly: false,
  });

  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Article deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete article: ${error.message}`);
    },
  });

  const togglePublishMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("Article status updated");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update article: ${error.message}`);
    },
  });

  if (authLoading) {
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

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleTogglePublish = (id: number, currentStatus: number) => {
    togglePublishMutation.mutate({
      id,
      published: currentStatus === 0,
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif mb-2">Article Management</h1>
            <p className="text-muted-foreground">Create, edit, and publish your articles</p>
          </div>
          <Button onClick={() => setLocation("/admin/article/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : articles && articles.length > 0 ? (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="font-serif text-2xl mb-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription>
                        <span className="uppercase text-xs font-bold tracking-wider text-primary">
                          {article.category}
                        </span>
                        {" · "}
                        {article.published === 1 ? (
                          <span className="text-green-600">Published</span>
                        ) : (
                          <span className="text-yellow-600">Draft</span>
                        )}
                        {" · "}
                        {new Date(article.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {article.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/admin/article/${article.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(article.id, article.published)}
                      disabled={togglePublishMutation.isPending}
                    >
                      {article.published === 1 ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      disabled={deleteMutation.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No articles yet</p>
              <Button onClick={() => setLocation("/admin/article/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Article
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
