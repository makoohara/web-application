import React, { useState, useEffect } from 'react';
import axios from '../AxiosConfig.js';
import SubSubTask from './SubSubTask';

function SubTask({ subTask, onDelete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [subSubTasks, setSubSubTasks] = useState([]);
    const [newSubSubTaskTitle, setNewSubSubTaskTitle] = useState('');

    const fetchSubSubTasks = () => {
        axios.get(`/subtasks/${subTask.id}/subsubtasks`)
            .then(response => {
                setSubSubTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching subsubtasks:", error);
            });
    };

    const handleAddSubSubTask = () => {
        axios.post(`/subtasks/${subTask.id}/subsubtasks`, { title: newSubSubTaskTitle })
            .then(response => {
                setSubSubTasks([...subSubTasks, response.data]);
                setNewSubSubTaskTitle('');
                fetchSubSubTasks();
            })
            .catch(error => {
                console.error("Error adding subsubtask:", error);
            });
    };

    const handleSubSubTaskDelete = (subSubTask) => {
        axios.delete(`subsubtasks/${subSubTask.id}`)
        .then(() => {
            fetchSubSubTasks();  // Fetch tasks after successful deletion
        })
        .catch(error => {
            console.error(`Error deleting task:`, error);
        });
    };

    const handleExpandClick = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            fetchSubSubTasks();
        }
    };

    return (
        <div>
            <h3>{subTask.title}</h3>
            <button onClick={handleExpandClick}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <button onClick={() => onDelete(subTask)}>Delete SubTask</button>
            {isExpanded && (
                <>
                    {subSubTasks.map(subSubTask => (
                        <SubSubTask 
                            key={subSubTask.id} 
                            subSubTask={subSubTask} 
                            onDelete={() => handleSubSubTaskDelete(subSubTask)}
                        />
                    ))}
                    <input 
                        type="text" 
                        value={newSubSubTaskTitle} 
                        onChange={e => setNewSubSubTaskTitle(e.target.value)} 
                        placeholder="New SubSubTask Title"
                    />
                    <button onClick={handleAddSubSubTask}>Add SubSubTask</button>
                </>
            )}
        </div>
    );
}

export default SubTask;
