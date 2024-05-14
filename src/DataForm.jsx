import { useEffect, useState } from "react";
import axios from 'axios';

function DataForm() {
    const [data, setData] = useState([]); 
    const [name, setName] = useState(''); 
    const [age, setAge] = useState(''); 
    const [error, setError] = useState(null); 
    const [editItem, setEditItem] = useState(null) 
 
    useEffect(() => { 
        axios.get('https://capable-lebkuchen-13055.netlify.app/.netlify/functions/api') 
            .then((response) => { 
                setData(response.data); 
            }) 
            .catch((error) => { 
                setError('Error occurred while fetching data: ' + error.message); 
            }); 
    }, []); 
 
    const handleSubmit = (e, id = null) => { 
        e.preventDefault(); 
        if (!name || !age) { 
            setError('Name and age is cannot be empty! '); 
            return; 
        } 
 
        const url = editItem 
            ? `https://capable-lebkuchen-13055.netlify.app/.netlify/functions/api/${editItem._id}`
            : 'https://capable-lebkuchen-13055.netlify.app/.netlify/functions/api';
        const method = editItem ? 'put' : 'post' 
 
        axios[method](url, { name, age }) 
            .then((response) => { 
                console.log(response.data); 
 
                if (editItem) { 
                    setData( 
                        data.map((item) => 
                            item._id === id ? response.data : item)); 
                } else { 
                    setData([...data, response.data.author]); 
                } 
                setName(''); 
                setAge(''); 
                setEditItem(null); 
                setError(null); 
            }) 
            .catch((error) => { 
                setError('Error occurred while submitting data: ' + error.message); 
            }); 
    } 
 
    const handleEdit = (_id) => { 
    const itemToEdit = data.find((item) => item._id === _id); 
    if (itemToEdit) {
        setEditItem(itemToEdit); 
        setName(itemToEdit.name); 
        setAge(itemToEdit.age); 
    } else {
        console.error("Item not found for editing.");
    }

}
 
 
    const handleDelete = (_id) => { 
        axios 
            .delete( 
                `https://capable-lebkuchen-13055.netlify.app/.netlify/functions/api/${_id}` 
            ) 
            .then(() => { 
                setData(data.filter((item) => item._id !== _id)); 
            }) 
            .catch((error) => { 
                console.log('Error occurred while deleting data: ' , error.message); 
            }); 
    }
    return (
            <div>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="input-field"
                />
                <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    className="input-field"
                />                 
                <button type="submit" className="submit-btn"> {editItem ?  'Update Data' : 'Add Data'}</button>
            </form>
            {error && <p>{error}</p>}
            

            <ul>
                {data.map((item) => (
                    <li key={item._id}>
                        {item.name} - {item.age}
                        <button onClick={() => handleEdit(item._id)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                    </li>
                ))}
            </ul>

        </div>
  )
}

export default DataForm
