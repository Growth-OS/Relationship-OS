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

  canvas.add(object);
  canvas.setActiveObject(object);
  canvas.renderAll();
};

export const addArrow = (canvas: fabric.Canvas) => {
  const arrow = new fabric.Path('M 0 0 L 200 0 L 190 -10 M 200 0 L 190 10', {
    left: 100,
    top: 100,
    stroke: '#4C1D95',
    strokeWidth: 2,
    fill: '',
    selectable: true,
    hasControls: true,
    hasBorders: true,
    lockScalingY: true,
    perPixelTargetFind: true,
  });

  // Add the arrow to canvas
  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.renderAll();

  // Add event listener for object movement
  arrow.on('moving', () => {
    canvas.renderAll();
  });

  // Add event listener for object rotation
  arrow.on('rotating', () => {
    canvas.renderAll();
  });
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
