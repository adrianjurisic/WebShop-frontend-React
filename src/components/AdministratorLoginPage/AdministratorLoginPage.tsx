import React from 'react';
import { Container, Card, Form, Button, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import api, { ApiResponse, saveToken, saveRefreshToken, saveIdentity } from '../../api/api';
import { Navigate } from 'react-router-dom';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorLoginPageState {
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export default class AdministratorLoginPage extends React.Component {
    state: AdministratorLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            isLoggedIn: false,
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const newState = Object.assign(this.state, {
            [ event.target.id ]: event.target.value,
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string) {
        const newState = Object.assign(this.state, {
            errorMessage: message,
        });

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    private doLogin() {
        api(
            'auth/administrator/login',
            'post',
            {
                username: this.state.username,
                password: this.state.password,
            }
        )
        .then((res: ApiResponse) => {
            if (res.status === 'error') {
                this.setErrorMessage('System error... Try again!');

                return;
            }

            if (res.status === 'ok') {
                if ( res.data.statusCode !== undefined ) {
                    let message = '';

                    switch (res.data.statusCode) {
                        case -3001: message = 'Unkwnon username!'; break;
                        case -3002: message = 'Bad password!'; break;
                    }

                    this.setErrorMessage(message);

                    return;
                }

                saveToken('administrator', res.data.token);
                saveRefreshToken('administrator', res.data.refreshToken);
                saveIdentity('administrator', res.data.identity);

                this.setLogginState(true);
            }
        });
    }

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Navigate to="/administrator/dashboard" />
            );
        }

        return (
            <Container>
                <RolledMainMenu role='guest'/>
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className='mt-3'>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faSignInAlt} /> Administrator Login
                            </Card.Title>
                            <Form 
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        this.doLogin();
                                    }
                                }}
                            >
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        id="username"
                                        value={this.state.username}
                                        onChange={(event) => this.formInputChanged(event as any)} 
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        id="password"
                                        value={this.state.password}
                                        onChange={(event) => this.formInputChanged(event as any)} 
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Button 
                                        variant="primary"
                                        onClick={() => this.doLogin()}
                                    >
                                        Log in
                                    </Button>
                                </Form.Group>
                            </Form>
                            <Alert 
                                variant="danger"
                                className={this.state.errorMessage ? '' : 'd-none'}
                            >
                                {this.state.errorMessage}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>

        );
    }
}