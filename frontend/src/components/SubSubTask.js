import React, { useState, useEffect } from 'react';
import axios from '../AxiosConfig.js';

function SubSubTask({ subTaskId }) {
    const [subSubTasks, setSubSubTasks] = useState([]);

    useEffect(() => {
        axios.get(`/subtasks/${subTaskId}/subsubtasks`)
            .then(response => {
                setSubSubTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching sub-subtasks:", error);
            });
    }, [subTaskId]);

    return (
        <div>
            {subSubTasks.map(subSubTask => (
                <div key={subSubTask.id}>
                    <h4>{subSubTask.title}</h4>
                </div>
            ))}
        </div>
    );
}

export default SubSubTask;
