import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './inwiNobg.png';
import { Link, Route, Routes , useNavigate} from 'react-router-dom';
import Addmaterial from '../Form/FormAddMaterial';
import Listmaterial from '../Table/listeMateriel';
import Affectation from '../Form/FormAffectation';
import Retourmateriel from '../Form/FormMaterialReturn';
/* import Home from '../home/home'; */
import Historique from '../Table/listeHistorique';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Addcollaborateur from '../Form/FormAddCollaborateur';
import Login from '../Form/FormLogin';
import { CiLogout } from 'react-icons/ci';
import jwtDecode from 'jwt-decode';
import AddUser from '../Form/FormAddNewUser';
import Etatdustock from '../Table/listeEtatStock';


function BasicExample() {
/*   const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
  }; */
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const token = localStorage.getItem('accessToken');
  let userRole = null;

  if (token) {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.scope;
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expirationTime');
    setIsLoggedIn(false);
    navigate('/');
    };
/* if (!isLoggedIn)
  {
  return (
 <Route path='/' element={<Login/>}/> 
  )

  }
 */
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary ln-background">
        <Container className="justify-content-Start">
          <Navbar.Brand as={Link} to='/etatdustock'>
            <img src={logo} alt="Logo" width="100" height="auto" />
          </Navbar.Brand>
        </Container>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
            <Nav.Item className='mx-5'>
            <NavDropdown title="Ajout" >
              <NavDropdown.Item href="/Addcollaborateur">Collaborateur</NavDropdown.Item>
              <NavDropdown.Item href="/Addmaterial">Materiel</NavDropdown.Item>
             {userRole === 'ADMIN' &&
             (
              <NavDropdown.Item href="/adduser">Utilisateur</NavDropdown.Item>
             )}      
            </NavDropdown>
            </Nav.Item>
            <Nav.Item className='mx-5'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="40" fill="currentColor" className="bi bi-dot" viewBox="0 0 16 16">
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                </svg>
                </Nav.Item>
              <Nav.Link as={Link} to='/Listmaterial' className='navbar-font'>Stock</Nav.Link>
              <Nav.Item className='mx-5'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="40" fill="currentColor" className="bi bi-dot" viewBox="0 0 16 16">
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                </svg>
              </Nav.Item>
              <Nav.Link as={Link} to='/Affectation' className='navbar-font'>Affectation</Nav.Link>
              <Nav.Item className='mx-5'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="40" fill="currentColor" className="bi bi-dot" viewBox="0 0 16 16">
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                </svg>
              </Nav.Item>
              <Nav.Link href="/Historique" className='navbar-font'>Historique</Nav.Link>
              <Nav.Item className='mx-5'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="40" fill="currentColor" className="bi bi-dot" viewBox="0 0 16 16">
                  <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                </svg>
              </Nav.Item>
              <Nav.Link as={Link} to='/Retour' className='navbar-font'>Retour</Nav.Link>
              </Nav>
          </Navbar.Collapse>
        </Container>
        <Nav.Item className='mx-5'>
            <Nav.Link onClick={handleLogout}>
              <CiLogout size={22} color='white' />
            </Nav.Link>
          </Nav.Item>
      </Navbar>

      <Routes>
        <Route path='/Addmaterial' element={<Addmaterial />} />
        <Route path='/Listmaterial' element={<Listmaterial />} />
        <Route path='/Affectation' element={<Affectation />} />
        <Route path='/Retour' element={<Retourmateriel />} />
        <Route path='/Historique' element={<Historique/>}/>
        <Route path='/Addcollaborateur'element={<Addcollaborateur/>}/>
        <Route path='/' element={<Login/>}/> 
        <Route path='/adduser' element={<AddUser/>}/>
        <Route path='/etatdustock' element={<Etatdustock/>}/>
      </Routes>
    </>
  );
}


export default BasicExample;
