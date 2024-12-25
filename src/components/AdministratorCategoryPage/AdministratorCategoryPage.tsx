import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faEdit, faListAlt, faListUl, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Navigate } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface AdministratorCategoryPageState {
    isAdministratorLoggedIn: boolean;
    categories: CategoryType[];
    addModal: {
        visible: boolean;
        name: string;
        imagePath: string;
        parentCategoryId: number | null;
        message: string;
    };
    editModal: {
        categoryId?: number;
        visible: boolean;
        name: string;
        imagePath: string;
        parentCategoryId: number | null;
        message: string;
    };
}

class AdministratorCategoryPage extends React.Component {
    state: AdministratorCategoryPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            categories: [],
            addModal: {
                visible: false,
                name: '',
                imagePath: '',
                parentCategoryId: null,
                message: '',
            },
            editModal: {
                visible: false,
                name: '',
                imagePath: '',
                parentCategoryId: null,
                message: '',
            },
        };
    }

    componentDidMount() {
        this.getCategories();
    }

    private getCategories(){
        api('/api/category/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            this.putCategoriesInState(res.data);
        });
    }

    private putCategoriesInState(data?: ApiCategoryDto[]) {
        const categories: CategoryType[] | undefined = data?.map(category => {
            return {
                categoryId: category.categoryId,
                name: category.name,
                imagePath: category.imagePath,
                parentCategoryId: category.parentCategoryId,
            };
        });

        const newState = Object.assign(this.state, {
            categories: categories,
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

                <Card className='mt-4'>

                    <Card.Header className="fs-4 fw-bold">
                        <FontAwesomeIcon icon={faListAlt} /> Categories
                    </Card.Header>

                    <Card.Body className="py-4">
                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Parent ID</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.categories.map((category) => (
                                        <tr key={category.categoryId}>
                                            <td>{category.categoryId}</td>
                                            <td>{category.name}</td>
                                            <td>
                                                {category.parentCategoryId !== undefined &&
                                                category.parentCategoryId !== null
                                                    ? category.parentCategoryId
                                                    : "-"}
                                            </td>
                                            <td className="text-center text-danger">
                                                <Link
                                                    to={"/administrator/dashboard/feature/" + category.categoryId}
                                                    className="btn btn-sm btn-info"
                                                    style={{ marginRight: '10px' }}>
                                                    <FontAwesomeIcon icon={faListUl} /> Features
                                                </Link>
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => this.showEditModal(category)}>
                                                    <FontAwesomeIcon icon={faEdit} /> EDIT
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>

                    <Card.Footer className="d-flex">
                        <Button variant='primary' className="ms-auto" onClick={() => this.showAddModal()}>
                            <FontAwesomeIcon icon={faPlus} /> ADD
                        </Button>
                    </Card.Footer>

                </Card>

                <Modal size="lg" centered show = {this.state.addModal.visible} onHide={() => this.setAddModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='name'>Name</Form.Label>
                            <Form.Control id='name' type='text' value={this.state.addModal.name} 
                                          onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mt-4'>
                            <Form.Label htmlFor='imagePath'>Image URL</Form.Label>
                            <Form.Control id='imagePath' type='url' value={this.state.addModal.imagePath} 
                                          onChange={(e) => this.setAddModalStringFieldState('imagePath', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='parentCategoryId'>Parent category</Form.Label>
                            <Form.Control id='parentCategoryId' as='select' value={this.state.addModal.parentCategoryId?.toString()} 
                                          onChange={(e) => this.setAddModalNumericFieldState('parentCategoryId', e.target.value)}>
                                <option value="null">No parent category</option>
                                {this.state.categories.map(category => (
                                    <option value={category.categoryId?.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {this.state.addModal.message ? (
                            <Alert variant='danger'>
                                {this.state.addModal.message}
                            </Alert>
                        ) : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.doAddCategory()}>
                            <FontAwesomeIcon icon={faPlus}/> SUBMIT
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal size="lg" centered show = {this.state.editModal.visible} onHide={() => this.setEditModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='name'>Name</Form.Label>
                            <Form.Control id='name' type='text' value={this.state.editModal.name} 
                                          onChange={(e) => this.setEditModalStringFieldState('name', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mt-4'>
                            <Form.Label htmlFor='imagePath'>Image URL</Form.Label>
                            <Form.Control id='imagePath' type='url' value={this.state.editModal.imagePath} 
                                          onChange={(e) => this.setEditModalStringFieldState('imagePath', e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='parentCategoryId'>Parent category</Form.Label>
                            <Form.Control id='parentCategoryId' as='select' value={this.state.editModal.parentCategoryId?.toString()} 
                                          onChange={(e) => this.setEditModalNumericFieldState('parentCategoryId', e.target.value)}>
                                <option value="null">No parent category</option>
                                {this.state.categories
                                .filter(category => category.categoryId !== this.state.editModal.categoryId)
                                .map(category => (
                                    <option value={category.categoryId?.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        {this.state.editModal.message ? (
                            <Alert variant='danger'>
                                {this.state.editModal.message}
                            </Alert>
                        ) : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.doEditCategory()}>
                            <FontAwesomeIcon icon={faEdit}/> SUBMIT
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        );
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

    private setAddModalNumericFieldState(fieldName: string, newValue: any){
        this.setState(Object.assign(this.state, Object.assign(this.state.addModal, {
            [fieldName]: (newValue === null) ? null : Number(newValue),
        })));
    }

    private showAddModal(){
        this.setAddModalStringFieldState('name', '');
        this.setAddModalStringFieldState('imagePath', '');
        this.setAddModalNumericFieldState('parentCategoryId', null);
        this.setAddModalStringFieldState('message', '');
        this.setAddModalVisibleState(true);
    }

    private doAddCategory(){
        api('api/category/', 'post', {
            name: this.state.addModal.name,
            imagePath: this.state.addModal.imagePath,
            parentCategory: this.state.addModal.parentCategoryId,
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
            this.getCategories();
        });
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

    private setEditModalNumericFieldState(fieldName: string, newValue: any){
        this.setState(Object.assign(this.state, Object.assign(this.state.editModal, {
            [fieldName]: (newValue === null) ? null : Number(newValue),
        })));
    }

    private showEditModal(category: CategoryType){
        this.setEditModalStringFieldState('name', String(category.name));
        this.setEditModalStringFieldState('imagePath', String(category.imagePath));
        this.setEditModalNumericFieldState('parentCategoryId', category.parentCategoryId);
        this.setEditModalNumericFieldState('categoryId', category.categoryId);
        this.setEditModalStringFieldState('message', '');
        this.setEditModalVisibleState(true);
    }

    private doEditCategory(){
        api('api/category/' + this.state.editModal.categoryId, 'patch', {
            name: this.state.editModal.name,
            imagePath: this.state.editModal.imagePath,
            parentCategory: this.state.editModal.parentCategoryId,
        }, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "login") {
                this.setLogginState(false);
                return;
            }
            if(res.status === 'error'){
                this.setEditModalStringFieldState('message', JSON.stringify(res.data));
                return;
            }
            this.setEditModalVisibleState(false);
            this.getCategories();
        });
    }

}

export default AdministratorCategoryPage;