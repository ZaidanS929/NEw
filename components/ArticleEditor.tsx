import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';

export default function ArticleEditor() {
  // We are removing the useAuth hook here as it is missing.
  // const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Article Title" />
        <textarea placeholder="Article Content" rows={10} className="w-full mt-4 p-2 border rounded" />
        <Button className="mt-4">Save Article</Button>
      </CardContent>
    </Card>
  );
}
