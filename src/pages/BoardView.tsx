import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Board = Database["public"]["Tables"]["boards"]["Row"];

const BoardView = () => {
  const { boardId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  const { data: board, isLoading } = useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();

      if (error) throw error;
      return data as Board;
    },
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 100,
      height: window.innerHeight - 300,
      backgroundColor: '#ffffff',
    });

    setFabricCanvas(canvas);
    toast.success("Canvas ready!");

    // Add event listener for window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 100,
        height: window.innerHeight - 300,
      });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const addRectangle = () => {
    if (!fabricCanvas) return;
    
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#8B5CF6',
      width: 100,
      height: 100,
    });
    
    fabricCanvas.add(rect);
    fabricCanvas.renderAll();
  };

  const addText = () => {
    if (!fabricCanvas) return;
    
    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#1F2937',
    });
    
    fabricCanvas.add(text);
    fabricCanvas.renderAll();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading board...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Board not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The board you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{board.name}</h1>
            {board.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">{board.description}</p>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Last edited: {new Date(board.last_edited_at).toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addRectangle}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Add Shape
            </button>
            <button
              onClick={addText}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Add Text
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
      </div>
    </div>
  );
};

export default BoardView;