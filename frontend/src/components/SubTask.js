import React from 'react';
import SubSubTask from './SubSubTask';
import useTaskActions from './useTaskActions';

function SubTask({subTask, onDelete }) {
    const { items: subSubTasks, handleDelete, handleAdd } = useTaskActions('subtasks', subTask.id, "subsubtasks", 'tasks');
    const [newSubSubTaskTitle, setNewSubSubTaskTitle] = React.useState(''); // <-- Add this state
    const DeleteSubTask = () => {
        handleDelete(subTask.id, 'tasks');
        if (onDelete) {
            onDelete(subTask.id);
        }
    };


    const handleAddSubSubTask = (title) => {
        handleAdd(title);
        setNewSubSubTaskTitle('');
    };

    return (
        <div className="subtask">
            <h3>{subTask.title}</h3>
            <button onClick={DeleteSubTask}>Delete SubTask</button>
            {subSubTasks && (
                <>
                    {subSubTasks.map(subSubTask => (
                        <SubSubTask key={subSubTask.id} subSubTask={subSubTask} />
                    ))}
                    <input 
                        type="text" 
                        placeholder="New SubSubTask Title"
                        value={newSubSubTaskTitle} // <-- Use the state value here
                        onChange={e => setNewSubSubTaskTitle(e.target.value)}  // <-- Set the state here 
                    />
                    <button onClick={() => handleAddSubSubTask(newSubSubTaskTitle)}>
                        Add SubSubTask
                    </button>
                </>
            )}
        </div>
    );
}

export default SubTask;
