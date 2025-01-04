import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SubstackPostFormData } from "@/components/substack/types";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export const useSubstackPost = (id?: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Get the current user session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();
  }, []);

  const { data: post, isLoading } = useQuery({
    queryKey: ["substack-post", id],
    queryFn: async () => {
      if (!id || !user) return null;
      const { data, error } = await supabase
        .from("substack_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch post",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!id && !!user,
  });

  const mutation = useMutation({
    mutationFn: async (data: SubstackPostFormData) => {
      if (!user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to create or edit posts",
          variant: "destructive",
        });
        throw new Error("User not authenticated");
      }

      const postData = {
        ...data,
        user_id: user.id,
      };

      if (id) {
        const { error } = await supabase
          .from("substack_posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("substack_posts")
          .insert([postData]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Post ${id ? "updated" : "created"} successfully`,
      });
      navigate("/dashboard/substack");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} post: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    post,
    isLoading,
    mutation,
    user,
  };
};