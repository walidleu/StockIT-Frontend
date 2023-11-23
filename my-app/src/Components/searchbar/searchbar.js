import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useState , useEffect} from "react";
import '../Style.css';
//import axios from "axios";

export default function SearchBar() {

  return (
    <Container className="mt-5">
      <Row>
        <Col sm={4}>
          <Form className="d-flex" controlId="marque">
            <Form.Control
              type="search"
              placeholder="Entrez la marque"
              className="me-2"
              aria-label="Search"
              required
            />
            <Button className='custom-button'>
              Search
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}