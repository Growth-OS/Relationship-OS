import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { BoardToolbar } from "@/components/board/BoardToolbar";
import { TooltipProvider } from "@/components/ui/tooltip";

type Board = Database["public"]["Tables"]["boards"]["Row"];

const BoardView = () => {
  const { boardId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>('select');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      isDrawingMode: false,
    });

    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = '#000000';

    setFabricCanvas(canvas);
    toast.success("Canvas ready!");

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 100,
        height: window.innerHeight - 300,
      });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.isDrawingMode = activeTool === 'draw';
    fabricCanvas.selection = activeTool === 'select';

    if (activeTool === 'select') {
      fabricCanvas.defaultCursor = 'default';
    } else if (activeTool === 'draw') {
      fabricCanvas.defaultCursor = 'crosshair';
    }
  }, [activeTool, fabricCanvas]);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvas || !event.target.files?.[0]) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (typeof e.target?.result !== 'string') return;

      fabric.Image.fromURL(e.target.result, (img) => {
        img.scaleToWidth(200);
        fabricCanvas.add(img);
        fabricCanvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    if (fabricCanvas._objects.length > 0) {
      fabricCanvas._objects.pop();
      fabricCanvas.renderAll();
    }
  };

  const handleRedo = () => {
    toast.info("Redo functionality coming soon!");
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => fabricCanvas.remove(obj));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Board not found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The board you're looking for doesn't exist or you don't have access to it.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {board.name}
                </h1>
                {board.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {board.description}
                  </p>
                )}
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Last edited: {new Date(board.last_edited_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <BoardToolbar
              fabricCanvas={fabricCanvas}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              handleImageUpload={handleImageUpload}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              handleDelete={handleDelete}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BoardView;