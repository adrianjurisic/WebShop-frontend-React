import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";
import { faSignIn } from '@fortawesome/free-solid-svg-icons';

export default class UserLoginPage extends React.Component {
    render(){
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon= { faSignIn } /> User Login
                        </Card.Title>
                        <Card.Text>
                            ... the form will be here ...
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}