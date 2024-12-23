import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorDashboardState {
    isAdministratorLoggedIn: boolean;
}

class AdministratorDashboard extends React.Component {
    state: AdministratorDashboardState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
        };
    }

    componentDidMount() {
        this.getMyData();
    }

    componentDidUpdate() {
        this.getMyData();
    }

    private getMyData(){
        api('/api/administrator/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Navigate to="/administrator/login" />
            );
        }

        return (
            <Container>
                <RolledMainMenu role='administrator'/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faHome } /> Administrator Dashboard
                        </Card.Title>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

}

export default AdministratorDashboard;