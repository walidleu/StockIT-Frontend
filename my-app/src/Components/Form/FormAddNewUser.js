import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal,Col,Row} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import "react-datepicker/dist/react-datepicker.css";
import { BiTrash } from 'react-icons/bi';

function FormAddNewUser() {
    const [username,setuserName]=useState('');
    const [password,setPassword]=useState('');
    const [role,setRole]=useState('');
    const [addmessage,setaddMessage]=useState('');
    const [users,setUsers]=useState([]);


    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
        };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    const formData ={
        username,
        password,
        role
    }
    try{
    axios.post("http://localhost:8081/addnewuser",formData ,{
        headers:headers
    })
        setaddMessage("Utilisateur ajoute !!")
       }catch{
        setaddMessage("Utilisateur NON ajoute !!")
       }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await axios.get("http://localhost:8081/users", {
                    headers: headers
                });
                setUsers(result.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
    
        fetchUsers();
    }, []);
    const handledelete = async (name) => {
      try {
          const response = await axios.delete(`http://localhost:8081/deleteuser/${name}`, {
              headers: headers,
          });
          console.log(response.data);

          // Remove the deleted user from the users state
          const updatedUsers = users.filter(user => user.username !== name);
          setUsers(updatedUsers);

      } catch (error) {
          console.error("Error deleting user:", error);
      }
  };
  return (
    <div
    className="modal show"
    style={{ display: 'block', position: 'initial' }}
  >
    <Modal.Dialog>
    {addmessage === 'Utilisateur ajoute !!' ? (

<div class="alert alert-success">{addmessage}</div>
) : (<></>
)}
{addmessage === 'Utilisateur NON ajoute !!' ? (

<div class="alert alert-danger">{addmessage}</div>
) : (<></>
)}
     <Modal.Header className="ln-background">
       <Modal.Title className='form-font-color'>Ajout Utilisateur</Modal.Title>
     </Modal.Header>
     <Modal.Body>
         <Form onSubmit={handleSubmit}>
         <Row className="mb-3"> 
         <Form.Group controlId="marque" as={Col} md="10">
             <Form.Label>Username</Form.Label>
             <Form.Control
             type="text"
               placeholder="username"
               value={username}
               onChange={(e) => setuserName(e.target.value)}
               required
             />
           </Form.Group>
           </Row>
           <Row>
           <Form.Group controlId="modele" as={Col} md="10">
             <Form.Label>password</Form.Label>
             <Form.Control
             type="text"
               placeholder="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
           </Form.Group>
        </Row>
        <Row>
        <Form.Group controlId="role" as={Col} md="6">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              defaultValue={'NOUVEAU'}
            >
            <option></option>
            <option >ADMIN</option>
            <option >USER</option>
            </Form.Select>
          </Form.Group>
        </Row>
          <Button variant="primary" type="submit" className="custom-button">
             Ajouter
           </Button >
           </Form>
       </Modal.Body>
     </Modal.Dialog>
     <Table striped bordered hover variant="light" className="font-">
     <thead>
          <tr>
            <th>#</th>
            <th>UserName</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {users.map((user, index) => (
            <tr key ={index}>
             <td>{index+1}</td>
             <td>{user.username}</td>
             <td>{users[index].roles[0]?.roleName}</td>
             <td>
                        <BiTrash
                            size={25}
                            color="red"
                            onClick={() => handledelete(user.username)}
                            style={{ cursor: 'pointer' }}
                        /> 
               </td>
            </tr>)
            )}
        </tbody>
      </Table>

     </div>
  )
}

export default FormAddNewUser