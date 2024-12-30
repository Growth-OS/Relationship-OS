import { useRef } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { BoardToolbar } from './BoardToolbar';
import { toast } from 'sonner';

export const BoardCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    fabricCanvas,
    activeTool,
    setActiveTool,
    undoStack,
    currentStateIndex,
    setCurrentStateIndex,
    setUndoStack,
  } = useCanvas(canvasRef);

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
        fabricCanvas.setActiveObject(img);
        fabricCanvas.renderAll();
        
        const json = JSON.stringify(fabricCanvas.toJSON());
        setUndoStack(prev => [...prev.slice(0, currentStateIndex + 1), json]);
        setCurrentStateIndex(prev => prev + 1);
      });
    };

    reader.readAsDataURL(file);
  };

  const handleUndo = () => {
    if (!fabricCanvas || currentStateIndex <= 0) return;
    
    const previousState = undoStack[currentStateIndex - 1];
    fabricCanvas.loadFromJSON(previousState, () => {
      fabricCanvas.renderAll();
      setCurrentStateIndex(prev => prev - 1);
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || currentStateIndex >= undoStack.length - 1) return;
    
    const nextState = undoStack[currentStateIndex + 1];
    fabricCanvas.loadFromJSON(nextState, () => {
      fabricCanvas.renderAll();
      setCurrentStateIndex(prev => prev + 1);
    });
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => fabricCanvas.remove(obj));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      
      const json = JSON.stringify(fabricCanvas.toJSON());
      setUndoStack(prev => [...prev.slice(0, currentStateIndex + 1), json]);
      setCurrentStateIndex(prev => prev + 1);
      
      toast.success("Objects deleted");
    }
  };

  return (
    <div className="space-y-4">
      <BoardToolbar
        fabricCanvas={fabricCanvas}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handleImageUpload={handleImageUpload}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleDelete={handleDelete}
      />
      <div className="border border-gray-200 rounded-lg">
        <canvas ref={canvasRef} className="max-w-full" />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};