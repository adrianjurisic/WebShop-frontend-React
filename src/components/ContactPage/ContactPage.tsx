import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';

export default class ContactPage extends React.Component{
    render(){
        return (
            <Container>
                <RolledMainMenu role='user'/>
                <Card>
                    <Card.Header>
                        <strong>
                            <FontAwesomeIcon icon={faPhone}/> Contact details
                        </strong>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex align-items-center mb-3">
                            <strong><p className="mb-0 me-2">LinkedIn:</p></strong>
                            <a href="https://www.linkedin.com/in/adrian-jurisic" target="_blank" rel="noopener noreferrer">
                                adrian_jurisic
                            </a>
                        </div>

                        <div className="d-flex align-items-center">
                            <strong><p className="mb-0 me-2">Github:</p></strong>
                            <a href="https://github.com/adrianjurisic" target="_blank" rel="noopener noreferrer">
                                adrianjurisic
                            </a>
                        </div>
                    </Card.Body>
                    <Card.Footer className='text-end'>
                        Created by Adrian Jurišić
                    </Card.Footer>
                </Card>
            </Container>
        );
    }
}