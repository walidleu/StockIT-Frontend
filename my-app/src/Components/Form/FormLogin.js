import React, { useState } from 'react'
import { Form, Button, Modal,Col,Row} from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import jwtDecode from 'jwt-decode';

function FormLogin() {
    const [username,setusername]=useState('');
    const [password,setPassword]=useState('');
    const [addMessage,setaddMessage]=useState("");
    const [IsLoggedIn , setIsLoggedIn] = useState(false);
  

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const response = await axios.post('http://localhost:8081/api/auth/v1/token', {
              username,
              password
          });

          const { accessToken, refreshToken } = response.data;

          // Set access token and expiration time in local storage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken); 
          const decodedToken = jwtDecode(accessToken);
          const expirationTime =decodedToken.exp;
          localStorage.setItem('expirationTime', expirationTime);

          // Set authentication status
          setIsLoggedIn(true);
          if (response.data.success) {
              // Redirect to home page
              window.location.href = '/etatdustock';
          } else {
              // Handle login error here
          }

          // Redirect user to the home page or handle tokens as needed
      } catch (error) {
          console.error('Login failed', error);
          // Handle login error
        }
    };
  return (
    <div
    className="modal show"
    style={{ display: 'block', position: 'initial' }}
  >
    <Modal.Dialog>
    {addMessage === 'Collaborateur Ajoute!' ? (

<div class="alert alert-success">{addMessage}</div>
) : (<></>
)}
{addMessage === 'Collaborateur non Ajoute !!' ? (

<div class="alert alert-danger">{addMessage}</div>
) : (<></>
)}
     <Modal.Header className="ln-background">
       <Modal.Title className='form-font-color'>Login</Modal.Title>
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
               onChange={(e) => setusername(e.target.value)}
               required
             />
           </Form.Group>
           </Row>
           <Row>
           <Form.Group controlId="modele" as={Col} md="10">
             <Form.Label>password</Form.Label>
             <Form.Control
             type="password"
               placeholder="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             />
           </Form.Group>
        </Row>
          <Button variant="primary" type="submit" className="custom-button">
             login
           </Button >
           </Form>
       </Modal.Body>
     </Modal.Dialog>
     </div>
  )
}

export default FormLogin