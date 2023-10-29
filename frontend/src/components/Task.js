import React, { useState } from 'react';
import axios from '../AxiosConfig.js';
import SubTask from './SubTask';

function Task({ task, onDelete, onSubTaskDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddSubTask = () => {
        axios.post(`/tasks/${task.id}/subtasks`, { title: newSubTaskTitle })
            .then(() => {
                onSubTaskDelete();  // Refresh the parent task list
                setNewSubTaskTitle('');
            })
            .catch(error => {
                console.error("Error adding subtask:", error);
            });
    };

    return (
        <div>
            <h2>{task.title}</h2>
            <button onClick={handleExpandClick}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button onClick={onDelete}>Delete Task</button>
            {isExpanded && (
                <>
                    <SubTask taskId={task.id} onSubSubTaskDelete={onSubTaskDelete} />
                    <input 
                        type="text" 
                        value={newSubTaskTitle} 
                        onChange={e => setNewSubTaskTitle(e.target.value)} 
                        placeholder="New SubTask Title"
                    />
                    <button onClick={handleAddSubTask}>Add SubTask</button>
                </>
            )}
        </div>
    );
}

export default Task;
