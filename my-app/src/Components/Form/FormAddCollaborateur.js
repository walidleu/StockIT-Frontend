import React, { useState } from 'react'
import { Form, Button, Modal,Col,Row} from 'react-bootstrap';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

function FormAddCollaborateur() {
    const [nom,setNom]=useState('');
    const [prenom,setPrenom]=useState('');
    const [addMessage,setaddMessage]=useState("");
    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
      };
    const handleSubmit = (event) => {
    const formData = {
        nom,
        prenom,
      };
  
      // Remplacez l'URL ci-dessous par l'URL de votre endpoint de sauvegarde des données dans la base de données
      const apiUrl = 'http://localhost:8081/addcollaborateur';
  
      // Envoie la requête POST avec Axios
      axios.post(apiUrl, formData, {
        headers: headers, // Include the headers here
      })
        .then((response) => {
          // Traitez la réponse ici si nécessaire
          console.log(response.data);
          // Fermez le Modal après l'envoi des données
          setPrenom('');
          setNom('');
          setaddMessage("Collaborateur Ajoute!");
          setTimeout(() => {
            setaddMessage(false);
          }, 10000); 
        })
        .catch((error) => {
            setaddMessage("Collaborateur non Ajoute !!");
            setTimeout(() => {
              setaddMessage(false);
            }, 10000); 
          });}
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
       <Modal.Title className='form-font-color'>Ajout Collaborateur</Modal.Title>
     </Modal.Header>
     <Modal.Body>
         <Form onSubmit={handleSubmit}>
         <Row className="mb-3"> 
         <Form.Group controlId="marque" as={Col} md="6">
             <Form.Label>Nom</Form.Label>
             <Form.Control
               placeholder="Nom"
               value={nom}
               onChange={(e) => setNom(e.target.value)}
               required
             />
           </Form.Group>
           <Form.Group controlId="modele" as={Col} md="6">
             <Form.Label>Prenom</Form.Label>
             <Form.Control
               placeholder="Prenom"
               value={prenom}
               onChange={(e) => setPrenom(e.target.value)}
               required
             />
           </Form.Group>
        </Row>
          <Button variant="primary" type="submit" className="custom-button">
             Ajouter Collaborateur
           </Button >
           </Form>
       </Modal.Body>
     </Modal.Dialog>
     </div>
  )
}

export default FormAddCollaborateur