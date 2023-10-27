import { useState, useEffect } from 'react';
import axios from '../AxiosConfig.js';
import { useNavigate } from 'react-router-dom';  


function useTaskActions(endpoint, id, subtasks, parentEndpoint = null) {
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const fetchData = (endpointToUse, idToUse, subtasksToUse) => {
        axios.get(`/${endpointToUse}/${idToUse}/${subtasksToUse}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setItems(response.data);
        })
        .catch(error => {
            console.error(`Error fetching ${endpointToUse}:`, error);
        });
    }

    useEffect(() => {
        fetchData(endpoint, id, subtasks);
    }, [endpoint, id, refresh]);


    // Function to get parent task ID based on child ID and endpoint
    const getParentTaskId = async (id, parentEndpoint) => {
        try {
            if (parentEndpoint === 'tasks') {
                const response = await axios.get(`/subtasks/${id}`);
                const subtask = response.data;
                console.log('task data:', subtask);
                return subtask.task_id;
            } else if (parentEndpoint === 'subtasks') {
                // Query the SubTask table to get the task_id
                const response = await axios.get(`/subsubtasks/${id}`);
                const subsubtask = response.data;
                console.log('subtask data:', subsubtask);
                return subsubtask.subtask_id;
            } else {
                return 0;
            }
        } catch (error) {
            console.error(`Error fetching parent ID for ${parentEndpoint}:`, error);
            return null;
        }
    };

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


    const handleDelete = async (itemId, parentEndpoint) => {
        const parentid = await getParentTaskId(itemId, parentEndpoint);
        console.log('Parent ID:', parentid);
    
    //     axios.delete(`/${endpoint}/${itemId}`)
    //         .then(() => {
    //             // After deletion is successful, toggle the refresh state
    //             // to cause useEffect to run and fetch updated data.
    //             setRefresh(prev => !prev);
    //         })
    //         .catch(error => {
    //             console.error(`Error deleting ${endpoint}:`, error);
    //         });
    // };
    
    const handleDelete = async (itemId, parentEndpoint) => {
        const parentid = await getParentTaskId(itemId, parentEndpoint);
        console.log('Parent ID:', parentid);
    
        axios.delete(`/${endpoint}/${itemId}`)
            .then(() => {
                if (parentid === 0) {
                    fetchTasks(); // Fetch from parent after deletion
                } 
                else {
                    fetchData(parentEndpoint, parentid, '');
                }
            })
            .catch(error => {
                console.error(`Error deleting ${endpoint}:`, error);
            });
    };
    
    

    const handleAdd = (title) => {
        axios.post(`/${endpoint}/${id}/${subtasks}`, { title })
            .then(response => {
                setRefresh(!refresh);
            })
            .catch(error => {
                console.error(`Error adding to ${endpoint}:`, error);
            });
    };

    return {
        items,
        handleDelete,
        handleAdd
    };
}}

export default useTaskActions;