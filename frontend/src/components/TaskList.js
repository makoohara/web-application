import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from '../AxiosConfig.js';
import Task from './Task';

function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false); // Initialize with true to fetch data on mount
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

    if (!token) {
        console.error("No token found");
        return;
    }

    axios.get('/get_current_user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            setUsername(response.data.username);
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
        });
    }, []);

    // Function to fetch tasks from server
    const fetchTasks = () => {
        axios.get('/tasks')
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
                if (error.response && error.response.status === 401) {
                    alert('Session expired. Please login again.');
                    navigate('/login');
                }
            });
    };


    
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        fetchTasks();
    }, [navigate]);

    useEffect(() => {
        if (refresh) {
            fetchTasks();
            setRefresh(false); // Reset refresh state after fetching
        }
    }, [refresh]);

// ... (rest of the imports and code)

const handleAddTask = () => {
    axios.post('/tasks', { title: newTaskTitle })
        .then(response => {
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
            fetchTasks();  // Fetch tasks after adding a new task
        })
        .catch(error => {
            console.error("Error adding task:", error);
        });
};

const handleTaskDelete = (task) => {
    axios.delete(`/tasks/${task.id}`)
        .then(() => {
            fetchTasks();  // Fetch tasks after successful deletion
        })
        .catch(error => {
            console.error(`Error deleting task:`, error);
        });
};


    return (
        <div>
            <div>
                <h2>Hello! {username}</h2>
            </div>
            
            <div className="container">
                {tasks.map(task => (
                    <Task 
                        key={task.id} 
                        task={task} 
                        onDelete={() => handleTaskDelete(task)}
                        onSubTaskDelete={fetchTasks}  // If you want to refresh after a subtask is deleted as well
                    />
                ))}
                <input 
                    type="text" 
                    value={newTaskTitle} 
                    onChange={e => setNewTaskTitle(e.target.value)} 
                    placeholder="New Task Title"
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>
        </div>
    );
}

export default TaskList;
