import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { initializeCanvas, updateCanvasMode } from '@/components/board/utils/canvasOperations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>, boardId: string) => {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);

  // Save canvas state to Supabase
  const saveCanvasState = async (canvasData: string) => {
    if (!boardId || isSaving) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('boards')
        .update({
          canvas_data: JSON.parse(canvasData),
          last_edited_at: new Date().toISOString()
        })
        .eq('id', boardId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize canvas
  useEffect(() => {
    // Wait for the next frame to ensure DOM is ready
    const timer = requestAnimationFrame(() => {
      if (!canvasRef.current) return;

      const canvas = initializeCanvas(canvasRef.current);
      
      if (!canvas) return;

      // Load existing canvas data
      const loadCanvasData = async () => {
        try {
          const { data, error } = await supabase
            .from('boards')
            .select('canvas_data')
            .eq('id', boardId)
            .maybeSingle();

          if (error) throw error;

          if (data?.canvas_data) {
            canvas.loadFromJSON(data.canvas_data, () => {
              canvas.renderAll();
              // Save initial state for undo
              const initialState = JSON.stringify(canvas.toJSON());
              setUndoStack([initialState]);
              setCurrentStateIndex(0);
            });
          } else {
            // Save initial state for new boards
            const initialState = JSON.stringify(canvas.toJSON());
            setUndoStack([initialState]);
            setCurrentStateIndex(0);
          }
        } catch (error) {
          console.error('Error loading canvas data:', error);
          toast.error('Failed to load board data');
        }
      };

      loadCanvasData();

      // Add event listener for object modifications
      canvas.on('object:modified', () => {
        const json = JSON.stringify(canvas.toJSON());
        setUndoStack(prev => [...prev.slice(0, currentStateIndex + 1), json]);
        setCurrentStateIndex(prev => prev + 1);
        saveCanvasState(json);
      });

      // Auto-save on any changes
      let autoSaveTimer: number;
      canvas.on('object:added', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = window.setTimeout(() => {
          const json = JSON.stringify(canvas.toJSON());
          saveCanvasState(json);
        }, 2000); // Auto-save after 2 seconds of inactivity
      });

      setFabricCanvas(canvas);

      const handleResize = () => {
        canvas.setDimensions({
          width: window.innerWidth - 100,
          height: window.innerHeight - 300,
        });
        canvas.renderAll();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(autoSaveTimer);
        cancelAnimationFrame(timer);
        canvas.dispose();
        window.removeEventListener('resize', handleResize);
      };
    });
  }, [canvasRef, boardId]);

  // Update canvas mode
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Ensure the canvas is ready before updating mode
    requestAnimationFrame(() => {
      updateCanvasMode(fabricCanvas, activeTool);
    });
  }, [activeTool, fabricCanvas]);

  // Manual save function
  const handleSave = async () => {
    if (!fabricCanvas) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON());
    await saveCanvasState(json);
    toast.success('Board saved successfully');
  };

  return {
    fabricCanvas,
    activeTool,
    setActiveTool,
    undoStack,
    currentStateIndex,
    setCurrentStateIndex,
    setUndoStack,
    handleSave,
    isSaving,
  };
};