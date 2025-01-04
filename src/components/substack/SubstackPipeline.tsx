import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { SubstackPost } from "@/integrations/supabase/types/content";

interface SubstackPipelineProps {
  posts: SubstackPost[];
  isLoading: boolean;
}

const STATUSES = ["idea", "writing", "passed_to_fausta", "schedule", "live"] as const;

const STATUS_LABELS = {
  idea: "Ideas",
  writing: "Writing",
  passed_to_fausta: "With Fausta",
  schedule: "Ready to Schedule",
  live: "Published",
};

export const SubstackPipeline = ({ posts, isLoading }: SubstackPipelineProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-5 gap-4">
        {STATUSES.map((status) => (
          <div key={status} className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-32 bg-gray-50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const postsByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = posts.filter((post) => post.status === status);
    return acc;
  }, {} as Record<typeof STATUSES[number], SubstackPost[]>);

  return (
    <div className="grid grid-cols-5 gap-4">
      {STATUSES.map((status) => (
        <div key={status} className="min-h-[500px]">
          <div className="bg-gray-100 rounded-t px-3 py-2 font-medium text-sm text-gray-700">
            {STATUS_LABELS[status]} ({postsByStatus[status].length})
          </div>
          <div className="bg-gray-50 rounded-b p-2 space-y-2">
            {postsByStatus[status].map((post) => (
              <Card
                key={post.id}
                className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
                onClick={() => navigate(`edit/${post.id}`)}
              >
                <h3 className="font-medium text-sm mb-1">{post.title}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(post.publish_date).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};