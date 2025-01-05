import { useRef, useEffect } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { BoardToolbar } from './BoardToolbar';
import { toast } from 'sonner';
import { fabric } from 'fabric';
import { useParams } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BoardCanvas = () => {
  const { boardId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!boardId) {
    toast.error('Board ID is required');
    return null;
  }

  const {
    fabricCanvas,
    activeTool,
    setActiveTool,
    undoStack,
    currentStateIndex,
    setCurrentStateIndex,
    setUndoStack,
    handleSave,
    isSaving,
  } = useCanvas(canvasRef, boardId);

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
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      
      const json = JSON.stringify(fabricCanvas.toJSON());
      setUndoStack(prev => [...prev.slice(0, currentStateIndex + 1), json]);
      setCurrentStateIndex(prev => prev + 1);
      
      toast.success("Objects deleted");
    } else {
      toast.error("No objects selected");
    }
  };

  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(zoom * 1.1);
    fabricCanvas.renderAll();
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(zoom / 1.1);
    fabricCanvas.renderAll();
  };

  // Set up canvas panning
  useEffect(() => {
    if (!fabricCanvas) return;

    let isPanning = false;
    let lastPosX: number;
    let lastPosY: number;

    fabricCanvas.on('mouse:down', (opt) => {
      const evt = opt.e;
      if (evt.altKey) {
        isPanning = true;
        fabricCanvas.selection = false;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    });

    fabricCanvas.on('mouse:move', (opt) => {
      if (isPanning && opt.e) {
        const deltaX = opt.e.clientX - lastPosX;
        const deltaY = opt.e.clientY - lastPosY;
        
        fabricCanvas.relativePan({ x: deltaX, y: deltaY });
        
        lastPosX = opt.e.clientX;
        lastPosY = opt.e.clientY;
      }
    });

    fabricCanvas.on('mouse:up', () => {
      isPanning = false;
      fabricCanvas.selection = true;
    });

  }, [fabricCanvas]);

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
        handleSave={handleSave}
        isSaving={isSaving}
      />
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Hold Alt + Click and drag to pan
        </span>
      </div>
      <ScrollArea className="h-[calc(100vh-300px)] border border-gray-200 rounded-lg">
        <div className="min-w-[2000px] min-h-[2000px] relative">
          <canvas ref={canvasRef} className="absolute" />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </ScrollArea>
    </div>
  );
};