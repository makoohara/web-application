import React, { useState } from 'react';
import SubTask from './SubTask';
import useTaskActions from './useTaskActions';

function Task({ task, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

    // Use the hook
    const { items: subTask, handleDelete: handleDelete, handleAdd: addSubTask } = useTaskActions('tasks', task.id, "subtasks", 'tasks');

    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDeleteTask = async () => {    
        handleDelete(task.id);
        if (onDelete) {
            onDelete(task.id);
        }    
    };
        // ... Rest of the delete task logic
    const deleteSubTask = async () => {    
        handleDelete(subTask.id);
        if (onDelete) {
            onDelete(subTask.id);
        }    
    };

    const handleAddSubTask = (title) => {
        addSubTask(title);
        setNewSubTaskTitle('');
    };

    return (
        <div>
            <h2 className="title">{task.title}</h2>
            <button onClick={handleExpandClick}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button onClick={handleDeleteTask}>Delete Task</button>
            {isExpanded && (
                <>
                    {subTask.map(subTask => (
                        <SubTask key={subTask.id} subTask={subTask} onDelete={deleteSubTask} />
                    ))}
                    <input 
                        type="text" 
                        value={newSubTaskTitle} 
                        onChange={e => setNewSubTaskTitle(e.target.value)} 
                        placeholder="New SubTask Title"
                    />
                    <button onClick={() => handleAddSubTask(newSubTaskTitle)}>Add SubTask</button>
                </>
            )}
        </div>
    );
}

export default Task;
