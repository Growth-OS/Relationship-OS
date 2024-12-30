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
  Save,
} from "lucide-react";
import { BoardToolbarButton } from "./BoardToolbarButton";
import { fabric } from "fabric";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { addShape, addArrow, addText } from "./utils/canvasOperations";

const SHAPE_COLORS = {
  purple: 'rgba(155, 135, 245, 0.5)',  // translucent purple
  blue: 'rgba(14, 165, 233, 0.5)',     // translucent blue
  green: 'rgba(16, 185, 129, 0.5)',    // translucent green
  yellow: 'rgba(245, 158, 11, 0.5)',   // translucent yellow
  red: 'rgba(239, 68, 68, 0.5)',       // translucent red
  gray: 'rgba(107, 114, 128, 0.5)',    // translucent gray
};

interface BoardToolbarProps {
  fabricCanvas: fabric.Canvas | null;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  handleImageUpload: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleDelete: () => void;
  handleSave: () => void;
  isSaving: boolean;
}

export const BoardToolbar = ({
  fabricCanvas,
  activeTool,
  setActiveTool,
  handleImageUpload,
  handleUndo,
  handleRedo,
  handleDelete,
  handleSave,
  isSaving,
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
                onClick={() => fabricCanvas && addShape(fabricCanvas, 'rect', color)}
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
                onClick={() => fabricCanvas && addShape(fabricCanvas, 'circle', color)}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <BoardToolbarButton
        icon={ArrowRight}
        tooltip="Add Arrow"
        onClick={() => fabricCanvas && addArrow(fabricCanvas)}
      />

      <BoardToolbarButton
        icon={Type}
        tooltip="Add Text"
        onClick={() => fabricCanvas && addText(fabricCanvas)}
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

      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
      
      <Button 
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};