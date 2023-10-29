import React, { useState, useEffect } from 'react';
import axios from '../AxiosConfig.js';
import SubSubTask from './SubSubTask';

function SubTask({ taskId, onSubSubTaskDelete }) {
    const [subTasks, setSubTasks] = useState([]);
    const [newSubSubTaskTitle, setNewSubSubTaskTitle] = useState('');

    // ... (rest of the imports and code)

    useEffect(() => {
        axios.get(`/tasks/${taskId}/subtasks`)
            .then(response => {
                setSubTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching subtasks:", error);
            });
    }, [taskId, onSubSubTaskDelete]);  // Add onSubSubTaskDelete as a dependency

    // ... (rest of the code)


    const handleAddSubSubTask = (subTaskId) => {
        axios.post(`/subtasks/${subTaskId}/subsubtasks`, { title: newSubSubTaskTitle })
            .then(response => {
                onSubSubTaskDelete();  // Refresh the parent subtask list
                setNewSubSubTaskTitle('');
            })
            .catch(error => {
                console.error("Error adding sub-subtask:", error);
            });
    };

    return (
        <div>
            {subTasks.map(subTask => (
                <div key={subTask.id}>
                    <h3>{subTask.title}</h3>
                    <SubSubTask subTaskId={subTask.id} />
                    <input 
                        type="text" 
                        value={newSubSubTaskTitle} 
                        onChange={e => setNewSubSubTaskTitle(e.target.value)} 
                        placeholder="New SubSubTask Title"
                    />
                    <button onClick={() => handleAddSubSubTask(subTask.id)}>Add SubSubTask</button>
                </div>
            ))}
        </div>
    );
}

export default SubTask;
