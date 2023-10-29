import React from 'react';

function SubSubTask({ subSubTask, onDelete }) {

    return (
        <div>
            <h4>{subSubTask.title}</h4>
            <button onClick={() => onDelete(subSubTask)}>Delete SubSubTask</button>
        </div>
    );
}

export default SubSubTask;
