import { useState, useEffect } from 'react';
import axios from '../AxiosConfig.js';

function useTaskActions(endpoint, id, subtasks, parentEndpoint) {
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(true); // Initialize with true to fetch data on mount
    const [taskdelete, setDelete] = useState(false);

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
        setRefresh(false); // Reset refresh state after fetching
    }, [endpoint, id, refresh]);

    const fetchParent = async () => {
        const parentid = await getParentTaskId();
        await axios.delete(`/${endpoint}/${id}`);
        if (endpoint === 'tasks') {
            axios.get(`/tasks`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            
        } else {
            axios.get(`/${parentEndpoint}/${parentid}/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDelete(false)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error(`Error fetching ${endpoint}:`, error);
            })
        }
        ;
    }



    const getParentTaskId = async () => {
        try {
            const response=await axios.get(`/${endpoint}/${id}`);
            const data = response.data
    
            if (parentEndpoint === 'subtasks') {
                return data.task_id; // Return task_id for subtasks
            } else if (parentEndpoint === 'subsubtasks') {
                return data.subtask_id; // Return subtask_id for subsubtask
            } else if (parentEndpoint === 'tasks') {
                return 0; // Return 0 for a task
            }
        } catch (error) {
            console.error(`Error fetching parent ID for ${parentEndpoint}:`, error);
            return null;
        }
    };
    
    const handleDelete = async (itemId) => {
        // try {
        await axios.delete(`/${endpoint}/${itemId}`)
                .then(response => {
                    setRefresh(true);
                });
        // } catch (error) {
        //     console.error(`Error deleting ${endpoint}:`, error);
        // }
        setRefresh(true);
    };

    const handleAdd = async (title) => {
        await axios.post(`/${endpoint}/${id}/${subtasks}`, { title })
            // .then(response => {
            //     setRefresh(true);
            // })
            .catch(error => {
                console.error(`Error adding to ${endpoint}:`, error);
            });
        setRefresh(true);
    };
    // const handleAdd = async (title) => {
    //     await axios.post(`/${endpoint}/${id}/${subtasks}`, { title })
    //         .then(response => {
    //             const newSubTask = response.data;
    //             setItems(prevItems => [...prevItems, newSubTask]); // Append the new subtask to the existing list
    //             setRefresh(true)
    //         })
    //         .catch(error => {
    //             console.error(`Error adding to ${endpoint}:`, error);
    //         });
    // };
    
    
    // const handleAdd = (title) => {
    //     const response=axios.post(`/${endpoint}/${id}/${subtasks}`, { title })
    //     console.log('response',response)
    //     const parsedData = JSON.parse(response.data);
    //     const data = parsedData.data;
    //     console.log('data', data)
    //     const subid = data.id
    //     console.log('subid',subid)
    //         .then(() => {
    //             axios.get(`/${subtasks}/${subid}`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('token')}`
    //                 }
    //             })
    //             .then(response => {
    //                 setItems(response.data);
    //             })
    //             .catch(error => {
    //                 console.error(`Error fetching ${endpoint}:`, error);
    //             });
    //         })
    //         .catch(error => {
    //             console.error(`Error adding to ${endpoint}:`, error);
    //         });
    // };

    return {
        items,
        handleDelete,
        handleAdd, 
        fetchData
    };
}

export default useTaskActions;