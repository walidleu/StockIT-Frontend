import { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import '../Style.css'
import axios from 'axios';
import DatePicker from "react-datepicker";
import { AiOutlineCopy } from 'react-icons/ai';
import jwtDecode from 'jwt-decode';

const FormExample=() =>{
  const [validated, setValidated] = useState(false);
  const [marque, setMarque] = useState('');
  const [collaborateurId, setCollaborateurId] = useState(null);
  const [materielId,setMaterielId]=useState(null);
  const [nomCollaborateur,setnomCollaborateur ]=useState('');
  const [prenomCollaborateur,setPrenomCollaborateur ]=useState('');
  const [numSerie, setNumSerie] = useState('');
  const [besoin,setbesoin] = useState('');
  const [collaborateur,setCollaborateur]=useState('');
  const [materiel,setMateriel]=useState('');
  const [addMessage,setaddMessage]=useState("");
  const [pret,setPret]=useState('');
  const decodedToken = jwtDecode(localStorage.getItem('accessToken'));
  const username =decodedToken.sub;
  const [user,setUser]=useState('');
  

  

  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
    };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

try {

  const response = await axios.get(`http://localhost:8081/user/${username}`, {
    headers: headers,
  });
  const userData = response.data;
  console.log("username", username);
  console.log("responseUser :", userData);
  console.log("user", userData.idUser);
  setUser(response.data);
  console.log("id :",user.idUser);
  console.log("username :",username);

    const responseCollaborator = await fetch(`http://localhost:8081/getCollaboratorId?nom=${nomCollaborateur}&prenom=${prenomCollaborateur}`, {
      headers: headers,
  });
    const collaboratorData = await responseCollaborator.json();
    const collaboratorId = collaboratorData.id;
    //console.log('Collaborator ID:', collaboratorId);
    setCollaborateurId(collaboratorId);
    setCollaborateur(collaboratorData);

    const responseMaterial = await fetch(`http://localhost:8081/getmaterielid?numserie=${numSerie}`, {
      headers: headers,
  });;
    const materialData = await responseMaterial.json();
    const materialId = materialData.id;
    console.log('Materiel ID:', materialId);
    setMaterielId(materialId);
    setMateriel(materialData);

    if (materialData.status === "disponible") {
      // Update materiel status
      const updatedMaterialData = {
        ...materialData,
        status: "nondisponible",
      };
      await axios.put(`http://localhost:8081/updatestatus/${materialId}`, updatedMaterialData, {
  headers: headers
});


      const historiqueData = {
        dateSortie: selectedDate,
        besoin:besoin,
        pret:pret,
        user:{idUser:userData.idUser},
        collaborateur: { id: collaboratorId },
        materiel: { id: materialId }
        
      };

      // Send POST request to add historique in the database
      const apiUrl='http://localhost:8081/addhistorique';
      await axios.post(apiUrl, historiqueData,{
        headers: headers
      });
      console.log('Historique enregistré avec succès.');
      setaddMessage("Materiel Affecter");
      setTimeout(() => {
        setaddMessage(false);
      }, 5000); 
    } else {
      console.log('Le materiel n\'est pas disponible.');
      setaddMessage("Materiel Non disponible");
      setTimeout(() => {
        setaddMessage(false);
      }, 5000); 
      return; // No need to proceed further if it's already unavailable
    }
  } catch (error) {
    // Handle errors
    console.error('Erreur lors du traitement :', error);
  }

      setValidated(true);
    }
  };
  useEffect(()=>{
    loadCollaborateurs();
  },[])
  const loadCollaborateurs=async(marque)=>{
    const result=await axios.get(`http://localhost:8081/collaborateurs`,{
      headers: headers
    });
    setCollaborateur(result.data);
  }
  const[materiels,setMateriels]=useState([]);
  useEffect(()=>{
    loadMateriels();
  },[])
  const loadMateriels=async(marque)=>{
    const result=await axios.get(`http://localhost:8081/searchbymarque/${marque}`,{
      headers: headers
    });
    setMateriels(result.data);
  }
 
  const handleSearch = () => {
    // Call the loadMateriels function to search by the entered brand (marque)
    loadMateriels(marque);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectedDate, setSelectedDate] = useState(null); 
  const [copiedNumSerie, setCopiedNumSerie] = useState(null);

  const handleCopyNumSerie = (numSerie) => {
    navigator.clipboard.writeText(numSerie);
    setCopiedNumSerie(numSerie);
  };
  return (
    <>
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
      width='100'
    >
      <Modal.Dialog>
      {addMessage === 'Materiel Affecter' ? (

<div class="alert alert-success">{addMessage}</div>
) : (<></>
)}
{addMessage === 'Materiel Non disponible' ? (

<div class="alert alert-danger">{addMessage}</div>
) : (<></>
)}
        <Modal.Header className="ln-background">
          <Modal.Title className='form-font-color'>Affectation Materiel</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="nomCollaborateur">
          <Form.Label className='font-color'>Nom collaborateur</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nom"value={nomCollaborateur}
            onChange={(e) => setnomCollaborateur(e.target.value)}
            required
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6"
              value={prenomCollaborateur}
              onChange={(e) => setPrenomCollaborateur(e.target.value)}>
          <Form.Label className='font-color'>Prénom collaborateur</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Prenom"
            
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
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
              value={besoin}
              onChange={(e) => setbesoin(e.target.value)}>
          <Form.Label className='font-color'>Besoin</Form.Label>
          <Form.Select aria-label="Default select example" required>
            <option></option>
            <option >NOUVELLE_RECRUE</option>
            <option >VOLE</option>
            <option >CASSE</option>
            <option >PERTE</option>
            <option >CHANGEMENT</option>
            <option >NOUVELLE_AFFECTATION</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} md="6"
        value={pret}
        onChange={(e) => setPret(e.target.value)}>
          <Form.Label className='font-color'>Pret pour</Form.Label>
            <Form.Select aria-label="Default select example" required>
              <option></option>
              <option >COLLABORATEUR</option>
              <option >CONSULTANT</option>
              <option >STAGIAIRE</option>
            </Form.Select>
        </Form.Group>
      </Row>
      <Row>
      <Form.Group as={Col} md="4" controlId="selectedDate">
      <Form.Label className="font-color">Date de Sortie</Form.Label>
      <DatePicker
     selected={selectedDate} // Utilisez une variable d'état (state) pour stocker la date sélectionnée
     onChange={handleDateChange} // Une fonction de gestionnaire d'événements pour mettre à jour la date sélectionnée
    dateFormat="dd/MM/yyyy" 
    required
     /> 
     </Form.Group>  
       </Row> 
          <Button
            type="submit"
            className='custom-button'
            variant='primary'
          > Affecter
          </Button>
          </Form>
        </Modal.Body>
        </Modal.Dialog>

     </div>
      <div>
      <div className='center-search-bar'>
      <Container className="mt-5">
      <Row>
        <Col sm={4}>
        <Form className="d-flex" >
              <Form.Control
                type="search"
                placeholder="Entrez la marque"
                className="me-2"
                aria-label="Search"
                value={marque}
                onChange={(e) => setMarque(e.target.value)}
                required
              />
              {/* Use onClick event for the button */}
              <Button className='custom-button' onClick={handleSearch}>
                Search
              </Button>
          </Form>
        </Col>
      </Row>
    </Container>
      </div>
      <Table striped bordered hover variant="light" className="font-">
      <thead>
        <tr>
          <th>#</th>
          <th>Modele</th>
          <th>Marque</th>
          <th>Numero de Serie</th>
          <th>Type</th>
          <th>Categorie</th>
          <th>Remarque</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {materiels.map((materiel, index) => {
    if (materiel.status === "disponible") {
      return (
        <tr key={index}>
              <td>{index + 1}</td>
              <td>{materiel.modele}</td>
              <td>{materiel.marque}</td>
              <td>{materiel.numSerie}</td>
              <td>{materiel.typeMateriel}</td>
              <td>{materiel.categorie}</td>
              <td>{materiel.remarque}</td>
              <td>
                  <AiOutlineCopy 
                  color='blue'
                   size={22} 
                   onClick={() => handleCopyNumSerie(materiel.numSerie)}
                   style={{ cursor: 'pointer' }}
                  />
              </td>
            </tr>
            );
    } else {
      return null;
    }
  })}
      </tbody>
    </Table>
    </div>
    </>
  );
}

export default FormExample;