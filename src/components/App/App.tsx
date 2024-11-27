import React from 'react';
import './App.css';
import {Container} from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { MainMenu } from '../MainMenu/MainMeni';

function App() {
  return (
    <Container className="App">
      <FontAwesomeIcon icon = {faHome} /> Home
    </Container>
  );
}

export default App;
