import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
}

interface ProjectsKanbanProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsKanban = ({ projects, isLoading }: ProjectsKanbanProps) => {
  const [columns, setColumns] = useState({
    active: projects.filter((p) => p.status === "active"),
    on_hold: projects.filter((p) => p.status === "on_hold"),
    completed: projects.filter((p) => p.status === "completed"),
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      const column = [...columns[source.droppableId as keyof typeof columns]];
      const [removed] = column.splice(source.index, 1);
      column.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: column,
      });
    } else {
      const sourceColumn = [...columns[source.droppableId as keyof typeof columns]];
      const destColumn = [...columns[destination.droppableId as keyof typeof columns]];
      const [removed] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {Object.entries(columns).map(([columnId, items]) => (
          <div key={columnId} className="space-y-4">
            <h3 className="font-medium capitalize">{columnId.replace('_', ' ')}</h3>
            <Droppable droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {items.map((project, index) => (
                    <Draggable
                      key={project.id}
                      draggableId={project.id}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 space-y-3"
                        >
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-gray-600">
                              {project.client_name}
                            </p>
                          </div>
                          
                          {project.budget && (
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              <span>{project.budget.toLocaleString()}</span>
                            </div>
                          )}
                          
                          {project.start_date && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {format(new Date(project.start_date), "MMM d, yyyy")}
                                {project.end_date && (
                                  <> - {format(new Date(project.end_date), "MMM d, yyyy")}</>
                                )}
                              </span>
                            </div>
                          )}
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};