import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentPreviewProps {
  content: string;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Post</CardTitle>
      </CardHeader>
      <CardContent>
        {content ? (
          <div className="prose max-w-none">
            {content}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Generated content will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};