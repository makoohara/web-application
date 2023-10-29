import React from 'react';
import axios from '../AxiosConfig.js';

function SubSubTask({ subSubTask, onDelete }) {

    return (
        <div>
            <h4>{subSubTask.title}</h4>
            <button onClick={() => onDelete(subSubTask)}>Delete SubSubTask</button>
        </div>
    );
}

export default SubSubTask;
