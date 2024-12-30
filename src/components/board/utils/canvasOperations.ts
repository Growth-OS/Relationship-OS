import { fabric } from "fabric";

export const initializeCanvas = (canvasElement: HTMLCanvasElement): fabric.Canvas | null => {
  try {
    const canvas = new fabric.Canvas(canvasElement, {
      width: window.innerWidth - 100,
      height: window.innerHeight - 300,
      backgroundColor: '#ffffff',
      isDrawingMode: false,
    });

    if (!canvas) return null;

    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = '#000000';

    return canvas;
  } catch (error) {
    console.error('Error initializing canvas:', error);
    return null;
  }
};

export const addShape = (
  canvas: fabric.Canvas, 
  shape: 'rect' | 'circle', 
  color: string
) => {
  const commonProps = {
    left: 100,
    top: 100,
    fill: color,
    strokeWidth: 1,
    stroke: 'rgba(76, 29, 149, 0.3)', // translucent stroke
    opacity: 1,
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

  canvas.add(object);
  canvas.setActiveObject(object);
  canvas.renderAll();
};

export const addArrow = (canvas: fabric.Canvas) => {
  // Create the line
  const line = new fabric.Line([0, 0, 200, 0], {
    stroke: '#4C1D95',
    strokeWidth: 2,
  });

  // Create the arrowhead
  const arrowHead = new fabric.Triangle({
    width: 20,
    height: 20,
    fill: '#4C1D95',
    left: 200,
    top: 0,
    angle: 90,
    originX: 'center',
    originY: 'center',
  });

  // Group the line and arrowhead together
  const arrow = new fabric.Group([line, arrowHead], {
    left: 100,
    top: 100,
    originX: 'center',
    originY: 'center',
    selectable: true,
    hasControls: true,
    lockScalingFlip: true, // Prevent flipping which would invert the arrow
  });

  // Add the arrow group to canvas
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.renderAll();
};

export const addText = (canvas: fabric.Canvas) => {
  const text = new fabric.IText('Double click to edit', {
    left: 100,
    top: 100,
    fontSize: 20,
    fill: '#1F2937',
    fontFamily: 'sans-serif',
  });
  
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
};

export const updateCanvasMode = (
  canvas: fabric.Canvas, 
  tool: string
) => {
  if (!canvas || !canvas.getContext()) return;

  try {
    canvas.isDrawingMode = tool === 'draw';
    
    if (tool === 'select') {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.hoverCursor = 'move';
    } else if (tool === 'draw') {
      canvas.selection = false;
      canvas.defaultCursor = 'crosshair';
      canvas.hoverCursor = 'crosshair';
    }
    
    canvas.renderAll();
  } catch (error) {
    console.error('Error updating canvas mode:', error);
  }
};