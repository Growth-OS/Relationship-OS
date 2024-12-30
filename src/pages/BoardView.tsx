import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import {
  Circle,
  Image,
  Pencil,
  Square,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Move,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Board = Database["public"]["Tables"]["boards"]["Row"];

const BoardView = () => {
  const { boardId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'draw' | 'shape' | 'text'>('select');
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

  const addShape = (type: 'rect' | 'circle') => {
    if (!fabricCanvas) return;
    
    const commonProps = {
      left: 100,
      top: 100,
      fill: '#8B5CF6',
      strokeWidth: 2,
      stroke: '#4C1D95',
    };

    const shape = type === 'rect' 
      ? new fabric.Rect({
          ...commonProps,
          width: 100,
          height: 100,
        })
      : new fabric.Circle({
          ...commonProps,
          radius: 50,
        });
    
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();
  };

  const addText = () => {
    if (!fabricCanvas) return;
    
    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#1F2937',
      fontFamily: 'sans-serif',
    });
    
    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    fabricCanvas.renderAll();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    // Implement redo functionality when history is added
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Board not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The board you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex flex-col gap-4">
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
          </div>
          
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === 'select' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setActiveTool('select')}
                >
                  <Move className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Select & Move</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === 'draw' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setActiveTool('draw')}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Draw</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addShape('rect')}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Rectangle</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => addShape('circle')}
                >
                  <Circle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Circle</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addText}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Text</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upload Image</TooltipContent>
            </Tooltip>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUndo}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRedo}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Selected</TooltipContent>
            </Tooltip>
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