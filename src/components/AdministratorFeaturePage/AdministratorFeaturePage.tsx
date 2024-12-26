import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faBackward, faEdit, faListUl, faNotdef, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Navigate, useParams } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import FeatureType from '../../types/FeatureType';
import ApiFeatureDto from '../../dtos/ApiFeatureDto';

interface AdministratorFeaturePageState {
    isAdministratorLoggedIn: boolean;
    features: FeatureType[];
        addModal: {
            visible: boolean;
            name: string;
            message: string;
        };
        editModal: {
            featureId?: number;
            visible: boolean;
            name: string;
            message: string;
        };
}

function withRouter(Component: React.ComponentType<any>) {
    return (props: any) => {
        const params = useParams();
        return <Component {...props} params={params} />;
    };
}

class AdministratorFeaturePage extends React.Component<{ params: { cId: string } }> {
    state: AdministratorFeaturePageState;

    constructor(props: { params: { cId: string } }) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            features: [],
            addModal: {
                visible: false,
                name: '',
                message: '',
            },
            editModal: {
                visible: false,
                name: '',
                message: '',
            },
        };
    }
    
    private setAddModalVisibleState(newState: boolean){
        this.setState(Object.assign(this.state, Object.assign(this.state.addModal, {
            visible: newState
        })));
    }

    private setAddModalStringFieldState(fieldName: string, newValue: string){
        this.setState(Object.assign(this.state, Object.assign(this.state.addModal, {
            [fieldName]: newValue
        })));
    }

    private setEditModalNumericFieldState(fieldName: string, newValue: any) {
        this.setState(Object.assign(this.state, Object.assign(this.state.editModal, {
            [fieldName]: (newValue === null) ? null : Number(newValue),
        })));
    }    

    private setEditModalVisibleState(newState: boolean){
        this.setState(Object.assign(this.state, Object.assign(this.state.editModal, {
            visible: newState
        })));
    }

    private setEditModalStringFieldState(fieldName: string, newValue: string){
        this.setState(Object.assign(this.state, Object.assign(this.state.editModal, {
            [fieldName]: newValue
        })));
    }
    
    componentDidMount() {
        this.getFeatures();
    }

    componentDidUpdate(oldProps: { params: { cId: string } }) {
        if (oldProps.params.cId === this.props.params.cId) {
            return;
        }
        this.getFeatures();
    }

    private getFeatures() {
        api(`/api/feature/values/${this.props.params.cId}`, 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            this.putFeaturesInState(res.data);
        });
    }
    
    private putFeaturesInState(data: { features: ApiFeatureDto[] }) {
        const features: FeatureType[] = data.features.map(feature => {
            return {
                featureId: feature.featureId,
                name: feature.name,
                values: feature.values
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
                <RolledMainMenu role="administrator" />

                <Card>
                    <Card.Header>
                        <Card.Title className='mb-3 fs-4 fw-bold'>
                            <Link to="/administrator/dashboard/category/"
                              className="btn btn-sm btn-secondary">
                                <FontAwesomeIcon icon={ faBackward } /> Back to categories
                            </Link>
                            <div className="d-flex justify-content-center align-items-center">
                                <FontAwesomeIcon icon={faListUl} className="me-2" /> Features (Category ID: {this.props.params.cId})
                            </div>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body className="py-4">
                        { this.state.features.length === 0 ? (
                            <div className="text-center">
                                <Alert variant="info">
                                    <FontAwesomeIcon icon={faNotdef} /> No features for this category yet!
                                </Alert>
                            </div>
                        ) : (
                            <Table hover size="sm" bordered>
                                <thead>
                                    <tr>
                                        <th className="text-right">ID</th>
                                        <th>Name</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.features.map(feature => (
                                        <tr key={ feature.featureId }>
                                            <td className="text-right">{ feature.featureId }</td>
                                            <td>{ feature.name }</td>
                                            <td className="text-center">
                                                <Button variant="info" size="sm"
                                                    onClick={ () => this.showEditModal(feature) }>
                                                    <FontAwesomeIcon icon={ faEdit } /> Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    )) }
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>

                    <Card.Footer className="d-flex">
                        <Button variant='primary' className="ms-auto" onClick={() => this.showAddModal()}>
                            <FontAwesomeIcon icon={faPlus} /> ADD
                        </Button>
                    </Card.Footer>
                </Card>

                <Modal size="lg" centered show={ this.state.addModal.visible } onHide={ () => this.setAddModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new feature</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" value={ this.state.addModal.name }
                                onChange={ (e) => this.setAddModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Form.Group>
                            <Button variant="primary" onClick={ () => this.doAddFeature() }>
                                <FontAwesomeIcon icon={ faPlus } /> Add new feature
                            </Button>
                        </Form.Group>
                        { this.state.addModal.message ? (
                            <Alert variant="danger">
                                { this.state.addModal.message }
                            </Alert>
                        ) : '' }
                    </Modal.Footer>
                </Modal>

                <Modal size="lg" centered show={ this.state.editModal.visible } onHide={ () => this.setEditModalVisibleState(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit feature</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" value={ this.state.editModal.name }
                                onChange={ (e) => this.setEditModalStringFieldState('name', e.target.value) } />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Form.Group>
                        <Button variant="primary" onClick={ () => this.doEditFeature() }>
                            <FontAwesomeIcon icon={ faEdit } /> Edit feature
                        </Button>
                        </Form.Group>
                        { this.state.editModal.message ? (
                            <Alert variant="danger">
                                { this.state.editModal.message }
                            </Alert>
                        ) : '' }
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }

    private showAddModal(){
        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('message', '');
        this.setAddModalVisibleState(true);
    }
    
    private doAddFeature(){
        api('/api/feature/', 'post', {
            name: this.state.addModal.name,
            categoryId: this.props.params.cId
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }
            if(res.status === 'error'){
                this.setAddModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }
            this.setAddModalVisibleState(false);
            this.getFeatures();
        });
    }

    private showEditModal(feature: FeatureType) {
        this.setEditModalStringFieldState('name', feature.name);
        this.setEditModalNumericFieldState('featureId', feature.featureId);
        this.setEditModalStringFieldState('message', '');
        this.setEditModalVisibleState(true);
    }
        
    private doEditFeature() {
        api(`/api/feature/${this.state.editModal.featureId}/`, 'patch', {
            name: this.state.editModal.name,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }
            if (res.status === 'error') {
                this.setEditModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }
            this.setEditModalVisibleState(false);
            this.getFeatures();
        });
    }     
}

export default withRouter(AdministratorFeaturePage);

