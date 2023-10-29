import React, { useState, useEffect } from 'react';
import axios from '../AxiosConfig.js';
import SubTask from './SubTask';

function Task({ task, onDelete, onSubTaskDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [subTasks, setSubTasks] = useState([]);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState('');

    const fetchSubTasks = () => {
        axios.get(`/tasks/${task.id}/subtasks`)
            .then(response => {
                setSubTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching subtasks:", error);
            });
    };

    const handleAddSubTask = () => {
        axios.post(`/tasks/${task.id}/subtasks`, { title: newSubTaskTitle })
            .then(response => {
                setSubTasks([...subTasks, response.data]);
                setNewSubTaskTitle('');
                fetchSubTasks();
            })
            .catch(error => {
                console.error("Error adding subtask:", error);
            });
    };

    const handleSubTaskDelete = (subTask) => {
        axios.delete(`/subtasks/${subTask.id}`)
        .then(() => {
            fetchSubTasks();  // Fetch tasks after successful deletion
        })
        .catch(error => {
            console.error(`Error deleting subtask:`, error);
        });
    };

    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            fetchSubTasks();
        }
    };

    return (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
            <h1>{task.title}</h1>
            <button onClick={handleExpandClick}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button onClick={() => onDelete(task)}>Delete Task</button>
            {isExpanded && (
                <div style={{ marginLeft: '20px' }}>
                    {subTasks.map(subTask => (
                        <SubTask 
                            key={subTask.id} 
                            subTask={subTask} 
                            onDelete={() => handleSubTaskDelete(subTask)}
                        />
                    ))}
                    <input 
                        type="text" 
                        value={newSubTaskTitle} 
                        onChange={e => setNewSubTaskTitle(e.target.value)} 
                        placeholder="New SubTask Title"
                    />
                    <button onClick={handleAddSubTask}>Add SubTask</button>
                </div>
            )}
        </div>
    );
}


export default Task;
