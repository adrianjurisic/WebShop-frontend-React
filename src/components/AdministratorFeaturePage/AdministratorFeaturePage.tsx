import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import FeatureType from '../../types/FeatureType';
import ApiFeatureDto from '../../dtos/ApiFeatureDto';

interface AdministratorFeaturePageState {
    isAdministratorLoggedIn: boolean;
    features: FeatureType[];
}

class AdministratorFeaturePage extends React.Component {
    state: AdministratorFeaturePageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            features: [],
        };
    }

    componentDidMount() {
        this.getFeatures();
    }

    componentDidUpdate() {
        this.getFeatures();
    }

    private getFeatures(){
        api('/api/feature/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            this.putFeaturesInState(res.data);
        });
    }

    private putFeaturesInState(data?: ApiFeatureDto[]) {
        const features: FeatureType[] | undefined = data?.map(feature => {
            return {
                featureId: feature.featureId,
                name: feature.name,
                categoryId: feature.categoryId,
            };
        });

        const newState = Object.assign(this.state, {
            features: features,
        });

        this.setState(newState);
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
                            <FontAwesomeIcon icon={ faListAlt } /> Features
                        </Card.Title>
                        <Table hover size='sm' bordered>
                            <thead>
                                <tr>
                                    <th className='text-right'>Feature ID</th>
                                    <th>Name</th>
                                    <th className='text-right'>Category ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.features.map(feature => (
                                    <tr>
                                        <td className='text-right'>{feature.featureId}</td>
                                        <td>{feature.name}</td>
                                        <td className='text-right'>{feature.categoryId}</td>
                                    </tr>
                                ), this)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default AdministratorFeaturePage;