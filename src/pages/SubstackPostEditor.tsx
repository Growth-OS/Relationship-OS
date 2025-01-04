import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubstackPost } from "@/hooks/useSubstackPost";
import { SubstackPostForm } from "@/components/substack/form/SubstackPostForm";

const SubstackPostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { post, isLoading, mutation, user } = useSubstackPost(id);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {id ? "Edit Post" : "Create New Post"}
        </h1>
      </div>

      <SubstackPostForm
        initialData={post}
        onSubmit={mutation.mutate}
        onCancel={() => navigate("/dashboard/substack")}
        isEdit={!!id}
      />
    </div>
  );
};

export default SubstackPostEditor;