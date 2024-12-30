import { 
  Circle, 
  Image, 
  Pencil, 
  Square, 
  Type, 
  Undo2, 
  Redo2, 
  Trash2, 
  Move 
} from "lucide-react";
import { BoardToolbarButton } from "./BoardToolbarButton";
import { fabric } from "fabric";

interface BoardToolbarProps {
  fabricCanvas: fabric.Canvas | null;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  handleImageUpload: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleDelete: () => void;
}

export const BoardToolbar = ({
  fabricCanvas,
  activeTool,
  setActiveTool,
  handleImageUpload,
  handleUndo,
  handleRedo,
  handleDelete,
}: BoardToolbarProps) => {
  return (
    <div className="flex flex-wrap gap-2 border-t pt-4">
      <BoardToolbarButton
        icon={Move}
        tooltip="Select & Move"
        onClick={() => setActiveTool('select')}
        active={activeTool === 'select'}
      />
      <BoardToolbarButton
        icon={Pencil}
        tooltip="Draw"
        onClick={() => setActiveTool('draw')}
        active={activeTool === 'draw'}
      />
      <BoardToolbarButton
        icon={Square}
        tooltip="Add Rectangle"
        onClick={() => {
          if (!fabricCanvas) return;
          const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: '#8B5CF6',
            width: 100,
            height: 100,
            strokeWidth: 2,
            stroke: '#4C1D95',
          });
          fabricCanvas.add(rect);
          fabricCanvas.setActiveObject(rect);
          fabricCanvas.renderAll();
        }}
      />
      <BoardToolbarButton
        icon={Circle}
        tooltip="Add Circle"
        onClick={() => {
          if (!fabricCanvas) return;
          const circle = new fabric.Circle({
            left: 100,
            top: 100,
            fill: '#8B5CF6',
            radius: 50,
            strokeWidth: 2,
            stroke: '#4C1D95',
          });
          fabricCanvas.add(circle);
          fabricCanvas.setActiveObject(circle);
          fabricCanvas.renderAll();
        }}
      />
      <BoardToolbarButton
        icon={Type}
        tooltip="Add Text"
        onClick={() => {
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
        }}
      />
      <BoardToolbarButton
        icon={Image}
        tooltip="Upload Image"
        onClick={handleImageUpload}
      />
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
      <BoardToolbarButton
        icon={Undo2}
        tooltip="Undo"
        onClick={handleUndo}
      />
      <BoardToolbarButton
        icon={Redo2}
        tooltip="Redo"
        onClick={handleRedo}
      />
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
      <BoardToolbarButton
        icon={Trash2}
        tooltip="Delete Selected"
        onClick={handleDelete}
      />
    </div>
  );
};