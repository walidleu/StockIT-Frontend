import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import '../Style.css';
import DatePicker from "react-datepicker";
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

function FormExample() {

  const [numSerie, setNumSerie] = useState('');
  const [validated, setValidated] = useState(false);
  const [materiel,setMateriel]=useState('');
  const[materielId,setMaterielId]=useState('');
  const [Recuperation,setRecuperation]=useState('');
  const [addMessage,setaddMessage]=useState("");
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setaddMessage("Materiel Non Retourné");
      setTimeout(() => {
        setaddMessage(false);
      }, 5000); 
    }else {
      event.preventDefault();
      const responseMaterial = await axios.get(`http://localhost:8081/getmaterielid?numserie=${numSerie}`, {
        headers: headers, // Include the headers here
      });
      const materialData = responseMaterial.data; // axios automatically parses JSON response
    const materialId = materialData.id;
    const responseHistorique = await axios.get(`http://localhost:8081/historiquereturn?id_materiel=${materialId}`, {
  headers: headers, // Include the headers here
});
const historiqueData = responseHistorique.data; // axios automatically parses JSON response

    console.log('Materiel ID:', materialId);
    setMaterielId(materialId);
    setMateriel(materialData);

    await axios.put(`http://localhost:8081/updatestatusreturn/${materialId}`, null, {
  headers: headers, // Include the headers here
});

    console.log(selectedDate);
    console.log(Recuperation);

    const result = await axios.put(`http://localhost:8081/updatedateentree/${historiqueData.id}`, {
  dateEntree: selectedDate,
  recuperation: Recuperation,
}, {
  headers: headers, // Include the headers here
});

    setaddMessage("Materiel Retourné !");
    setTimeout(() => {
      setaddMessage(false);
    }, 5000); 

    setValidated(true);
  }
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
      {addMessage === 'Materiel Retourné !' ? (

<div class="alert alert-success">{addMessage}</div>
) : (<></>
)}
{addMessage === 'Materiel Non Retourné' ? (

<div class="alert alert-danger">{addMessage}</div>
) : (<></>
)}
        <Modal.Header className="ln-background">
          <Modal.Title className='form-font-color'>Retour Materiel</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-6">
        <Form.Group as={Col} md="6" 
              value={numSerie}
              onChange={(e) => setNumSerie(e.target.value)}>
          <Form.Label className='font-color'>N° Serie</Form.Label>
            <Form.Control
              type="text"
              placeholder="Num_serie"
              required
              
            />
            <Form.Control.Feedback type="invalid">
              Please enter serial number.
            </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6"
        value={Recuperation}
        onChange={(e) => setRecuperation(e.target.value)}>
          <Form.Label className='font-color'>Recuperation</Form.Label>
            <Form.Select aria-label="Default select example" required>
              <option></option>
              <option >DEPART</option>
              <option >CHANGEMENT</option>
            </Form.Select>
        </Form.Group>
        <Row>
      <Form.Group as={Col} md="4" 
      >
      <Form.Label className="font-color">Date d'Entrée</Form.Label>
      <DatePicker
     selected={selectedDate} // Utilisez une variable d'état (state) pour stocker la date sélectionnée
     onChange={handleDateChange} // Une fonction de gestionnaire d'événements pour mettre à jour la date sélectionnée
    dateFormat="dd/MM/yyyy" 
    required
     /> 
     <Form.Control.Feedback type="invalid">
              Please Enter Date.
            </Form.Control.Feedback>
     </Form.Group>  
       </Row> 
      </Row>
          <Button
            type="submit"
            className='custom-button'
            variant='primary'
          > valider
          </Button>
          </Form>
          </Modal.Body>
      </Modal.Dialog>
    </div>
  );
}
export default FormExample;