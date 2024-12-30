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
  ArrowRight,
} from "lucide-react";
import { BoardToolbarButton } from "./BoardToolbarButton";
import { fabric } from "fabric";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SHAPE_COLORS = {
  purple: '#9b87f5',
  blue: '#0EA5E9',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  gray: '#6B7280',
};

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
  const addShape = (shape: 'rect' | 'circle', color: string) => {
    if (!fabricCanvas) return;
    
    const commonProps = {
      left: 100,
      top: 100,
      fill: color,
      strokeWidth: 2,
      stroke: '#4C1D95',
    };

    const object = shape === 'rect' 
      ? new fabric.Rect({
          ...commonProps,
          width: 100,
          height: 100,
        })
      : new fabric.Circle({
          ...commonProps,
          radius: 50,
        });

    fabricCanvas.add(object);
    fabricCanvas.setActiveObject(object);
    fabricCanvas.renderAll();
  };

  const addArrow = () => {
    if (!fabricCanvas) return;
    
    const arrow = new fabric.Path('M 0 0 L 200 0 L 190 -10 M 200 0 L 190 10', {
      left: 100,
      top: 100,
      stroke: '#4C1D95',
      strokeWidth: 2,
      fill: '',
    });

    fabricCanvas.add(arrow);
    fabricCanvas.setActiveObject(arrow);
    fabricCanvas.renderAll();
  };

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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={activeTool === 'rectangle' ? "secondary" : "ghost"}
            size="icon"
            className="relative"
          >
            <Square className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-32 bg-white">
          <div className="grid grid-cols-3 gap-1 p-2">
            {Object.entries(SHAPE_COLORS).map(([name, color]) => (
              <button
                key={name}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => addShape('rect', color)}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={activeTool === 'circle' ? "secondary" : "ghost"}
            size="icon"
            className="relative"
          >
            <Circle className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-32 bg-white">
          <div className="grid grid-cols-3 gap-1 p-2">
            {Object.entries(SHAPE_COLORS).map(([name, color]) => (
              <button
                key={name}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
                onClick={() => addShape('circle', color)}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <BoardToolbarButton
        icon={ArrowRight}
        tooltip="Add Arrow"
        onClick={addArrow}
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