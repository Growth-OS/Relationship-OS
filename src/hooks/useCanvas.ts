import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { updateCanvasMode } from '@/components/board/utils/canvasOperations';

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<string>('select');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);

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
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);

  useEffect(() => {
    if (!fabricCanvas) return;
    updateCanvasMode(fabricCanvas, activeTool);
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