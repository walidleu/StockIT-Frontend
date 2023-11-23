import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import '../Style.css';
import { MdCancel } from 'react-icons/md';
import { AiFillCheckCircle } from 'react-icons/ai';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { BiTrash } from 'react-icons/bi';
import jwtDecode from 'jwt-decode';


function DarkExample() {
  const [materiels, setMateriels] = useState([]);
  const [numSerie, setnumSerie] = useState('');
  // const [deleteMessage, setDeleteMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
    };

const token = localStorage.getItem('accessToken'); // Assuming you store the token in localStorage
const decodedToken = jwtDecode(token);
const userRole = decodedToken.scope;


  useEffect(() => {
    // Lorsque la valeur de la variable d'état "marque" change, lancez la recherche
    if (numSerie !== '') {
      searchMaterielsByMarque();
    } else {
      // Si la barre de recherche est vide, affichez tous les matériels
      loadMateriels();
    }
  }, [numSerie]); // Surveiller uniquement les changements de la variable d'état "marque"

  const loadMateriels = async () => {
    try {
      const result = await axios.get("http://localhost:8081/materiels", {
          headers: headers,
      });
      setMateriels(result.data);
      console.log(result);
  } catch (error) {
      console.error("Error loading articles:", error);
        }

  };
  const handledelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/deletemateriel/${id}`, {
        headers: headers,
      });
  
      // Update the materiels state to reflect the deleted item
      setMateriels(prevMateriels => prevMateriels.filter(materiel => materiel.id !== id));
  
      console.log(`Materiel with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting materiel:", error);
    }
  };  
  const searchMaterielsByMarque = async () => {
    try {
      const result = await axios.get(`http://localhost:8081/searchbyserialnumber/${numSerie}`, {
          headers: headers,
      });
      setMateriels(result.data);
      console.log(result);
  } catch (error) {
      console.error("Error loading articles:", error);
        }
  };

  const handleSearch = () => {
    // Call the loadMateriels function to search by the entered brand (marque)
    loadMateriels(numSerie);
  };


  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = materiels.slice(indexOfFirstItem, indexOfLastItem);

/*   const totalPages = Math.ceil(materiels.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(
      <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
        {i}
      </Pagination.Item>
    );
  } */
  const totalPages = Math.ceil(materiels.length / itemsPerPage);

  const renderEllipsis = () => <Pagination.Ellipsis disabled />;
  const renderPaginationItem = (pageNum) => (
    <Pagination.Item
      key={pageNum}
      active={pageNum === currentPage}
      onClick={() => setCurrentPage(pageNum)}
    >
      {pageNum}
    </Pagination.Item>
  );

  return (
    <>
      {/* {deleteMessage && <div alert alert-success>{deleteMessage}</div>} */}
      <Row>
        <Col sm={4}>
        <Form className="d-flex" >
              <Form.Control
                type="search"
                placeholder="Entrez le Numero de Serie"
                className="me-2"
                aria-label="Search"
                value={numSerie}
                onChange={(e) => setnumSerie(e.target.value)}
                required
              />
              {/* Use onClick event for the button */}
              <Button className='custom-button' onClick={handleSearch}>
                Search
              </Button>
          </Form>
        </Col>
      </Row>
      <Table striped bordered hover variant="light" className="font-">
        <thead>
          {/* Header Row */}
          <tr>
            <th>#</th>
            <th>Date entree initiale</th>
            <th>Marque</th>
            <th>Modele</th> 
            <th>Numero de Serie</th>
            <th>Type</th>
            <th>Categorie</th>
            <th>Status</th>
            {userRole === 'ADMIN' && (
            <th></th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Data Rows */}
          {currentItems.map((materiel, index) => (
            <tr key={index}>
              <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td>{materiel.dateEntreeInitiale}</td>
              <td>{materiel.marque}</td>
              <td>{materiel.modele}</td>
              <td>{materiel.numSerie}</td>
              <td>{materiel.typeMateriel}</td>
              <td>{materiel.categorie}</td>
              {/* Condition pour afficher l'icône en fonction du statut du matériel */}
      {materiel.status === 'nondisponible' ? (
        <td>
          <MdCancel size={25} color="red" />
        </td>
      ) : (
        <td>
          <AiFillCheckCircle size={25} color="green" />
        </td>
      )}
         
          {userRole === 'ADMIN' && (
            <td>
              <BiTrash
                  size={25}
                  color="red"
                  onClick={() => handledelete(materiel.id)}
                  style={{ cursor: 'pointer' }}
              />
            </td>
          )}
           
            </tr>
          ))}

        </tbody>
      </Table>
      {/* Pagination */}
      <Pagination>
        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
        {currentPage > 2 && renderPaginationItem(1)}
        {currentPage > 3 && renderEllipsis()}
        {currentPage > 1 && renderPaginationItem(currentPage - 1)}
        {renderPaginationItem(currentPage)}
        {currentPage < totalPages && renderPaginationItem(currentPage + 1)}
        {currentPage < totalPages - 2 && renderEllipsis()}
        {currentPage < totalPages - 1 && renderPaginationItem(totalPages)}
        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </>
  );
}

export default DarkExample;
