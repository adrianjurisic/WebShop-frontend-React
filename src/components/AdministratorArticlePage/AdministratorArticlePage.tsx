import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { faEdit, faListAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArticleType from '../../types/ArticleType';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface AdministratorArticlePageState {
    isAdministratorLoggedIn: boolean;
    articles: ArticleType[];
    categories: CategoryType[];
    addModal: {
        visible: boolean;
        message: string;
        name: string;
        categoryId: number;
        excerpt: string;
        description: string;
        status: "available" | "visible" | "hidden";
        isPromoted: 1 | 0;
        price: number;
        features: {
            featureId: number;
            value: string;
        }[];
    };
    editModal: {
        articleId?: number;
        visible: boolean;
        message: string;
        name: string;
        categoryId: number;
        excerpt: string;
        description: string;
        status: "available" | "visible" | "hidden";
        isPromoted: 1 | 0;
        price: number;
        features: {
            featureId: number;
            value: string;
        }[];
    };
}

class AdministratorArticlePage extends React.Component {
    state: AdministratorArticlePageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            articles: [],
            categories: [],
            addModal: {
                visible: false,
                message: '',
                name: '',
                categoryId: 0,
                excerpt: '',
                description: '',
                status: "hidden",
                isPromoted: 0,
                price: 0.01,
                features: [],
            },
            editModal: {
                visible: false,
                message: '',
                name: '',
                categoryId: 0,
                excerpt: '',
                description: '',
                status: "hidden",
                isPromoted: 0,
                price: 0.01,
                features: [],
            },
        };
    }

    componentDidMount() {
        this.getCategories();
        this.getArticles();
    }

    private getArticles(){
        api('/api/article/', 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            this.putArticlesInState(res.data);
        });
    }

    private putArticlesInState(data?: ApiArticleDto[]) {
        const articles: ArticleType[] | undefined = data?.map(article => {
            return {
                articleId: article.articleId,
                name: article.name,
                excerpt: article.excerpt,
                description: article.description,
                imageUrl: article.photos[0].imagePath,
                price: article.articlePrices[article.articlePrices.length-1].price,
                status: article.status,
                isPromoted: article.isPromoted,
                articleFeatures: article.articleFeatures,
                features: article.features,
                articlePrices: article.articlePrices,
                photos: article.photos,
                category: article.category,
            };
        });

        this.setState(Object.assign(this.state, {
            articles: articles,
        }));
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
                        <FontAwesomeIcon icon={faListAlt} /> Articles
                    </Card.Header>

                    <Card.Body className="py-4">
                        <Table hover size="sm" bordered>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Promoted</th>
                                    <th className='text-end'>Price</th>
                                    <th className='text-center'>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.articles.map((article) => (
                                        <tr key={article.articleId}>
                                            <td>{article.articleId}</td>
                                            <td>{article.name}</td>
                                            <td>{article.category?.name}</td>
                                            <td>{article.status}</td>
                                            <td className='text-center'>
                                                {article.isPromoted === 1
                                                    ? "YES"
                                                    : "-"}
                                            </td>
                                            <td className='text-end'>{article.price} BAM</td>
                                            <td className="text-center text-danger">
                                                <Button
                                                    variant="info"
                                                    size="sm"
                                                    onClick={() => this.showEditModal(article)}>
                                                    <FontAwesomeIcon icon={faEdit} /> EDIT
                                                </Button>
                                                <Button
                                                    className='ms-3'
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => this.showEditModal(article)}>
                                                    <FontAwesomeIcon icon={faTrash} /> DELETE
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
                            <FontAwesomeIcon icon={faPlus} /> NEW ARTICLE
                        </Button>
                    </Card.Footer>

                </Card>

                <Modal size="lg" centered show = {this.state.addModal.visible} onHide={() => this.setAddModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='add-name'>Name</Form.Label>
                            <Form.Control id='add-name' type='text' value={this.state.addModal.name} 
                                          onChange={(e) => this.setAddModalStringFieldState('name', e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='add-categoryId'>Category ID</Form.Label>
                            <Form.Control id='add-categoryId' as='select' value={this.state.addModal.categoryId?.toString()} 
                                          onChange={(e) => this.setAddModalNumericFieldState('categoryId', e.target.value)}>
                                {this.state.categories.map(category => (
                                    <option value={category.categoryId?.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='add-excerpt'>Excerpt</Form.Label>
                            <Form.Control id='add-excerpt' type='text' value={this.state.addModal.excerpt} 
                                          onChange={(e) => this.setAddModalStringFieldState('excerpt', e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='add-description'>Description</Form.Label>
                            <Form.Control id='add-description' as='textarea' value={this.state.addModal.description} 
                                          onChange={(e) => this.setAddModalStringFieldState('description', e.target.value)}
                                          rows={10}
                            />
                        </Form.Group>

                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='add-status'>Status</Form.Label>
                            <Form.Control id='add-status' as='select' value={this.state.addModal.status.toString()} 
                                          onChange={(e) => this.setAddModalStringFieldState('status', e.target.value)}>
                                    <option value="available">Available</option>
                                    <option value="visible">Visible</option>
                                    <option value="hidden">Hidden</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='add-isPromoted'>Parent category</Form.Label>
                            <Form.Control id='add-isPromoted' as='select' value={this.state.addModal.isPromoted.toString()} 
                                          onChange={(e) => this.setAddModalNumericFieldState('isPromoted', e.target.value)}>
                                <option value={0}>NOT PROMOTED</option>
                                <option value={1}>PROMOTED</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='add-price'>Price</Form.Label>
                            <Form.Control id='add-price' type='number' value={this.state.addModal.price} 
                                          onChange={(e) => this.setAddModalStringFieldState('price', e.target.value)}
                            />
                        </Form.Group>

                        {this.state.addModal.message ? (
                            <Alert variant='danger'>
                                {this.state.addModal.message}
                            </Alert>
                        ) : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.doAddArticle()}>
                            <FontAwesomeIcon icon={faPlus}/> SUBMIT
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal size="lg" centered show = {this.state.editModal.visible} onHide={() => this.setEditModalVisibleState(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='edit-name'>Name</Form.Label>
                            <Form.Control id='edit-name' type='text' value={this.state.editModal.name} 
                                          onChange={(e) => this.setEditModalStringFieldState('name', e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='edit-categoryId'>Category ID</Form.Label>
                            <Form.Control id='edit-categoryId' as='select' value={this.state.editModal.categoryId?.toString()} 
                                          onChange={(e) => this.setEditModalNumericFieldState('categoryId', e.target.value)}>
                                {this.state.categories.map(category => (
                                    <option value={category.categoryId?.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='edit-excerpt'>Excerpt</Form.Label>
                            <Form.Control id='edit-excerpt' type='text' value={this.state.editModal.excerpt} 
                                          onChange={(e) => this.setEditModalStringFieldState('excerpt', e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='edit-description'>Description</Form.Label>
                            <Form.Control id='edit-description' as='textarea' value={this.state.editModal.description} 
                                          onChange={(e) => this.setEditModalStringFieldState('description', e.target.value)}
                                          rows={10}
                            />
                        </Form.Group>

                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='edit-status'>Status</Form.Label>
                            <Form.Control id='edit-status' as='select' value={this.state.editModal.status.toString()} 
                                          onChange={(e) => this.setEditModalStringFieldState('status', e.target.value)}>
                                    <option value="available">Available</option>
                                    <option value="visible">Visible</option>
                                    <option value="hidden">Hidden</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className='mt-4 mb-4'>
                            <Form.Label htmlFor='edit-isPromoted'>Parent category</Form.Label>
                            <Form.Control id='edit-isPromoted' as='select' value={this.state.editModal.isPromoted.toString()} 
                                          onChange={(e) => this.setEditModalNumericFieldState('isPromoted', e.target.value)}>
                                <option value={0}>NOT PROMOTED</option>
                                <option value={1}>PROMOTED</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='edit-price'>Price</Form.Label>
                            <Form.Control id='edit-price' type='number' value={this.state.editModal.price} 
                                          onChange={(e) => this.setEditModalStringFieldState('price', e.target.value)}
                            />
                        </Form.Group>


                        {this.state.editModal.message ? (
                            <Alert variant='danger'>
                                {this.state.editModal.message}
                            </Alert>
                        ) : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' onClick={() => this.doEditArticle()}>
                            <FontAwesomeIcon icon={faPlus}/> SUBMIT
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
        this.setAddModalNumericFieldState('categoryId', null);
        this.setAddModalStringFieldState('excerpt', '');
        this.setAddModalStringFieldState('description', '');
        this.setAddModalStringFieldState('status', 'hidden');
        this.setAddModalNumericFieldState('isPromoted', 0);
        this.setAddModalNumericFieldState('price', null);
        this.setAddModalStringFieldState('message', '');
        this.setAddModalVisibleState(true);
    }

    private doAddArticle(){
        api('api/article/', 'post', {
            name: this.state.addModal.name,
            categoryId: this.state.addModal.categoryId,
            excerpt: this.state.addModal.excerpt,
            description: this.state.addModal.description,
            status: this.state.addModal.status,
            isPromoted: this.state.addModal.isPromoted,
            price: this.state.addModal.price,
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
            this.getArticles();
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

    private showEditModal(article: ArticleType){
        this.setEditModalStringFieldState('name', String(article.name));
        this.setEditModalNumericFieldState('categoryId', String(article.category?.name));
        this.setEditModalStringFieldState('excerpt', String(article.excerpt));
        this.setEditModalStringFieldState('description', String(article.description));
        this.setEditModalStringFieldState('status', String(article.status));
        this.setEditModalNumericFieldState('isPromoted', String(article.isPromoted));
        this.setEditModalNumericFieldState('price', String(article.price));
        this.setEditModalStringFieldState('message', '');
        this.setEditModalVisibleState(true);
    }

    private doEditArticle(){
        api('api/article/' + this.state.editModal.categoryId, 'patch', {
            name: this.state.editModal.name,
            categoryId: this.state.editModal.categoryId,
            excerpt: this.state.editModal.excerpt,
            description: this.state.editModal.description,
            status: this.state.editModal.status,
            isPromoted: this.state.editModal.isPromoted,
            price: this.state.editModal.price,
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
            this.getArticles();
        });
    }

}

export default AdministratorArticlePage;