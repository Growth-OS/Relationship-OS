import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export const SubstackCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["substackPosts"],
    queryFn: async () => {
      try {
        console.log("Fetching substack posts...");
        const { data, error } = await supabase
          .from("substack_posts")
          .select("*")
          .order("publish_date", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Posts fetched successfully:", data);
        return data;
      } catch (err) {
        console.error("Error fetching posts:", err);
        toast.error("Failed to load posts. Please try again later.");
        throw err;
      }
    },
  });

  const publishDates = posts?.map((post) => new Date(post.publish_date)) || [];

  if (error) {
    console.error("Query error:", error);
  }

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-8">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md"
            modifiers={{
              booked: publishDates,
            }}
            modifiersStyles={{
              booked: { fontWeight: "bold", backgroundColor: "#E2E8F0" },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center py-4">Loading posts...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load posts. Please try again later.
            </div>
          ) : (
            <>
              <h3 className="font-medium mb-4">
                {selectedDate?.toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              {posts
                ?.filter(
                  (post) =>
                    new Date(post.publish_date).toDateString() ===
                    selectedDate?.toDateString()
                )
                .map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg mb-2">
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: {post.status}
                    </p>
                  </div>
                ))}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};