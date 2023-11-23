import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import { MdCancel } from 'react-icons/md';
import { AiFillCheckCircle } from 'react-icons/ai';


function StockOverview() {
  const [stockData, setStockData] = useState([]);
  const headers = {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json',
    };

  useEffect(() => {
     axios.get('http://localhost:8081/etatdustock', {
      headers: headers,
    }) 
      .then(response => {
        setStockData(response.data);
        console.log(stockData);   
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);

  return (
    <div>
      <h1 className="centered-text">Aperçu de l'état du stock</h1>
      <div className="dashboard">
        {stockData.map((item, index) => (
          <div className="card" key={index}>
            <h2>{item[0]}</h2>
            <p>Quantité : {item[1]}</p>
            {item[2] === 'nondisponible' ? (
              <p>Statut : <MdCancel size={25} color="red" /></p>
            ) : (
              <p>Statut : <AiFillCheckCircle size={25} color="green" /></p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockOverview;
