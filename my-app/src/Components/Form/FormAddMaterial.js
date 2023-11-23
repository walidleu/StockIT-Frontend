import React, { useState } from 'react';
import { Form, Button, Modal,Col,Row} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AddElementForm = () => {
  const [modele, setModele] = useState('');
  const [marque, setMarque] = useState('');
  const [numSerie, setNumSerie] = useState('');
  const [categorie, setCategorie] = useState('');
  const [typeMateriel, setTypeMateriel] = useState('');
  const [addMessage,setaddMessage]=useState("");
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
    };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Créez l'objet de données à envoyer au serveur
    const formData = {
      modele,
      marque,
      numSerie,
      categorie,
      typeMateriel,
      dateEntreeInitiale: selectedDate,
      status:"disponible"
    };

    // Remplacez l'URL ci-dessous par l'URL de votre endpoint de sauvegarde des données dans la base de données
    const apiUrl = 'http://localhost:8081/addmateriel';

    // Envoie la requête POST avec Axios
    axios.post(apiUrl, formData, {
      headers: headers, // Include the headers here
    })
      .then((response) => {
        // Traitez la réponse ici si nécessaire
        console.log(response.data);
        // Fermez le Modal après l'envoi des données
        setModele('');
        setMarque('');
        setNumSerie('');
        setaddMessage("Materiel Ajoute!");
        setTimeout(() => {
          setaddMessage(false);
        }, 5000); 
      })
      .catch((error) => {
        // Gérez les erreurs ici si nécessaire
        console.error('Une erreur s\'est produite lors de l\'envoi des données :', error);
        setaddMessage("Materiel Non Ajoute numero serie deja existant!");
        setTimeout(() => {
          setaddMessage(false);
        }, 5000); 
      });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectedDate, setSelectedDate] = useState(null); 
  return (
    <div
    className="modal show"
    style={{ display: 'block', position: 'initial' }}
    width='100'
  >
    
    <Modal.Dialog>
   {addMessage === 'Materiel Ajoute!' ? (

          <div class="alert alert-success">{addMessage}</div>
      ) : (<></>
      )}
         {addMessage === 'Materiel Non Ajoute numero serie deja existant!' ? (

<div class="alert alert-danger">{addMessage}</div>
) : (<></>
)}
    <Modal.Header className="ln-background">
      <Modal.Title className='form-font-color'>Ajout Materiel</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    
        <Form onSubmit={handleSubmit}>
        <Row className="mb-3"> 
        <Form.Group controlId="marque" as={Col} md="6">
            <Form.Label>Marque</Form.Label>
            <Form.Control
              placeholder="Marque"
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter serial number.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="modele" as={Col} md="6">
            <Form.Label>Modèle</Form.Label>
            <Form.Control
              placeholder="Modele"
              value={modele}
              onChange={(e) => setModele(e.target.value)}
              required
            />
          </Form.Group>
       </Row>
       <Row>
          <Form.Group controlId="categorie" as={Col} md="6">
            <Form.Label>Catégorie</Form.Label>
            <Form.Select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              required
              defaultValue={'NOUVEAU'}
            >
            <option></option>
            <option >RECYCLE</option>
            <option >NOUVEAU</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group controlId="typeMateriel" as={Col} md="6">
            <Form.Label>Type de Matériel</Form.Label>
            <Form.Select 
              value={typeMateriel}
              onChange={(e) => setTypeMateriel(e.target.value)}
              required
            >
            <option></option>
            <option >LAPTOP</option>
            <option >DESKTOP</option>
            <option>ACCESSOIRE</option>
             </Form.Select>
          </Form.Group>
        </Row>
       <Row>
          <Form.Group controlId="numSerie" as={Col} md="6">
            <Form.Label>Numéro de Série</Form.Label>
            <Form.Control
              placeholder="N°Serie"
              value={numSerie}
              onChange={(e) => setNumSerie(e.target.value)}
              required
            />
          </Form.Group>
        </Row>
        <Form.Group as={Col} md="4" controlId="selectedDate">
  <Form.Label className="font-color">Date d'entrée</Form.Label>
  <DatePicker
     selected={selectedDate} // Utilisez une variable d'état (state) pour stocker la date sélectionnée
     onChange={handleDateChange} // Une fonction de gestionnaire d'événements pour mettre à jour la date sélectionnée
    dateFormat="dd/MM/yyyy" 
    required
  />
</Form.Group>
         <Button variant="primary" type="submit" className="custom-button">
            Ajouter l'élément
          </Button >
          </Form>
      </Modal.Body>
    </Modal.Dialog>
    </div>
  );
};

export default AddElementForm;
