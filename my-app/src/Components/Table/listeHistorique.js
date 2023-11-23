import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import { BiTrash } from 'react-icons/bi';
import jwtDecode from 'jwt-decode';

function ListeHistorique() {
  const [materiels, setMateriels] = useState([]);
  const [collaborateur, setCollaborateur] = useState('');
  const [historiques, setHistoriques] = useState([]);
  const [numSerie, setnumSerie] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track the current page number
  const itemsPerPage = 9;
  const token = localStorage.getItem('accessToken'); // Assuming you store the token in localStorage
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.scope;
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
    };
  useEffect(() => {
    // Fetch data based on search criteria and current page
    fetchData();
  }, [collaborateur, numSerie, currentPage]);

  const fetchData = async () => {
    let url = "http://localhost:8081/historiques";
    if (collaborateur !== '' && numSerie === '') {
      url = `http://localhost:8081/historiquescollaborateur?nom_prenom_collab=${collaborateur}`;
    } else if (collaborateur === '' && numSerie !== '') {
      url = `http://localhost:8081/historiquesmateriel?numserie=${numSerie}`;
    }

    try {
      const result = await axios.get(url, {
          headers: headers,
      });
      setHistoriques(result.data);
      console.log(result);
  } catch (error) {
      console.error("Error loading articles:", error);
        }
  };
  const handledelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/deletehistorique/${id}`, {
        headers: headers,
      });
  
      // Update the materiels state to reflect the deleted item
      setHistoriques(prevHisoriques => prevHisoriques.filter(hisorique => hisorique.id !== id));
  
      console.log(`hisorique with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting hisorique:", error);
    }
  }; 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = historiques.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(historiques.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
        {i}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <h4>N°Serie :</h4>
      <Row>
        <Col sm={4}>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Entrez le Numero de Serie"
              className="me-2"
              aria-label="Search"
              value={numSerie}
              onChange={(e) => setnumSerie(e.target.value)}
              required
            />
            <Button className='custom-button' onClick={() => setnumSerie('')}>
              Reset
            </Button>
          </Form>
        </Col>
      </Row>
      <h4>Collaborateur :</h4>
      <Row>
        <Col sm={4}>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Entrez le Nom du Collaborateur"
              className="me-2"
              aria-label="Search"
              value={collaborateur}
              onChange={(e) => setCollaborateur(e.target.value)}
              required
            />
            <Button className='custom-button' onClick={() => setCollaborateur('')}>
              Reset
            </Button>
          </Form>
        </Col>
      </Row>
      <Table striped bordered hover variant="light" className="font-">
        <thead>
          <tr>
            <th>#</th>
            <th>date D'Affectation</th>
            <th>date De Retour</th>
            <th>Marque</th>
            <th>Modele</th>
            <th>N°Serie</th>
            <th>Collaborateur</th>
            <th>Recuperation</th>
            <th>Besoin</th>
            <th>affecte par</th>
            {userRole === 'ADMIN' && (
            <th></th>
            )}
          </tr>
        </thead>
        <tbody>
        {currentItems.map((historique, index) => (
              <tr key={index}>
                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td>{historique.dateSortie}</td>
                <td>{historique.dateEntree}</td>
                <td>{historique.materiel.marque}</td>
                <td>{historique.materiel.modele}</td>
                <td>{historique.materiel.numSerie}</td>
                <td>{historique.collaborateur.nom} {historique.collaborateur.prenom}</td>
                <td>{historique.recuperation}</td>
                <td>{historique.besoin}</td>
                <td>{historique.user.username}</td>
                    {userRole === 'ADMIN' && (
                <td>
                        <BiTrash
                            size={25}
                            color="red"
                            onClick={() => handledelete(historique.id)}
                            style={{ cursor: 'pointer' }}
                        />
               </td>
                    )}

              </tr>
           ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {pageNumbers}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
}

export default ListeHistorique;
