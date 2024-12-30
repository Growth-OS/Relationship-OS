import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { initializeCanvas, updateCanvasMode } from '@/components/board/utils/canvasOperations';

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    // Wait for the next frame to ensure DOM is ready
    const timer = requestAnimationFrame(() => {
      if (!canvasRef.current) return;

      const canvas = initializeCanvas(canvasRef.current);
      
      if (!canvas) return;

      // Save initial state
      const initialState = JSON.stringify(canvas.toJSON());
      setUndoStack([initialState]);
      setCurrentStateIndex(0);

      // Add event listener for object modifications
      canvas.on('object:modified', () => {
        const json = JSON.stringify(canvas.toJSON());
        setUndoStack(prev => [...prev.slice(0, currentStateIndex + 1), json]);
        setCurrentStateIndex(prev => prev + 1);
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
        cancelAnimationFrame(timer);
        canvas.dispose();
        window.removeEventListener('resize', handleResize);
      };
    });
  }, [canvasRef]);

  // Update canvas mode
  useEffect(() => {
    if (!fabricCanvas) return;
    
    // Ensure the canvas is ready before updating mode
    requestAnimationFrame(() => {
      updateCanvasMode(fabricCanvas, activeTool);
    });
  }, [activeTool, fabricCanvas]);

  return {
    fabricCanvas,
    activeTool,
    setActiveTool,
    undoStack,
    currentStateIndex,
    setCurrentStateIndex,
    setUndoStack,
  };
};