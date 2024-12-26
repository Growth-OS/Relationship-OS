import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentPreviewProps {
  content: string;
}

export const ContentPreview = ({ content }: ContentPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {content ? (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Generated content will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};