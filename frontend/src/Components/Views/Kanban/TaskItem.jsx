import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Flag } from 'lucide-react';
import {getEmptyImage} from 'react-dnd-html5-backend'
import style from '../../../Styles/kanban.module.css';
import TaskModal from './TaskModal';

const TaskItem = ({ task, projectName, projectId, updateTaskStatus, updateTask, removeDeletedTaskFromUI }) => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "TASK",
    item: { ...task },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));


  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  

  const formattedDate = (dateObj) => {
    if(!dateObj || !dateObj.$date) {
      return "";
    }
    const date = new Date(dateObj.$date);
    return isNaN(date.getTime()) ? "INVALID FORMAT" : date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'normal':
        return "#11c229";
      case 'medium':
        return '#e9e613';
      case "high":
        return 'red';
      default:
        return "gray";
    }
  };

  const handleTaskClick = () => {
    setTaskModalOpen(true);
  };

  const handleModalClose = () => {
    setTaskModalOpen(false);
  };

  
 const getStatusColor = (status) => {
     switch (status) {
        case "To-do":
          return style.toDo;
        case "In Progress":
          return style.inProgress;
        case "In Review":
          return style.inReview;
        case 'Complete':
          return style.complete;
        default:
          return "";
    }
    };

      
    const getBorderColorForStatus = (status) => {
      switch (status) {
        case "To-do":
          return style.toDoBorder;
        case "In Progress":
          return style.inProgressBorder;
        case "In Review":
          return style.inReviewBorder;
        case 'Complete':
          return style.completeBorder;
        default:
          return "";
      }
    };

  return (
    <div ref={drag} className={`${style.taskItem} ${getBorderColorForStatus(task.status)} ${isDragging && style.draggingState}`} onClick={handleTaskClick}  >
      {taskModalOpen && (
        <TaskModal
          onClose={handleModalClose}
          task={task}
          formattedDate={formattedDate}
          projectName={projectName}
          projectId={projectId}
          updateTaskStatus={updateTaskStatus}
          updateTask={updateTask}
          removeDeletedTaskFromUI={removeDeletedTaskFromUI}
        />
      )}
      <div className={`${style.taskProject} ${getStatusColor(task.status)}`}>
        {projectName}
      </div>
      <div className={style.taskName}>
        {task.task_name}
      </div>
      <div className={style.taskNote}>
        {task.task_notes}
      </div>
      <div className={style.taskProperty}>
        <div className={style.taskDates}>{task.started_at} - {task.due_date}</div>
        <div className={style.taskPriority}>
          <Flag color={getPriorityColor(task.priority)} absoluteStrokeWidth /> {task.priority}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;