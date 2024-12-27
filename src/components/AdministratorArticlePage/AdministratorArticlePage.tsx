import React from 'react';
import { Container, Card, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { faEdit, faImages, faListAlt, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Navigate } from 'react-router-dom';
import api, {apiFile, ApiResponse} from '../../api/api';
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
        price: number;
        features: {
            use: number;
            featureId: number;
            name: string;
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
            use: number;
            featureId: number;
            name: string;
            value: string;
        }[];
    };
}

interface FeatureBaseType {
    name: string;
    featureId: number;
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

    private async getFeaturesByCategoryId(categoryId: number): Promise<FeatureBaseType[]> {
        return await new Promise((resolve) => {
            api(`/api/feature/values/${categoryId}`, 'get', {}, 'administrator')
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    this.setLogginState(false);
                    return resolve([]);
                }
    
                if (!res.data || !Array.isArray(res.data.features)) {
                    return resolve([]);
                }
    
                const features: FeatureBaseType[] = res.data.features.map((item: any) => ({
                    featureId: item.featureId,
                    name: item.name,
                }));
        
                resolve(features);
            })
            .catch((error) => {
                resolve([]);
            });
        });
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
                categoryId: article.categoryId,
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

    private async addModalCategoryChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setAddModalNumericFieldState('categoryId', event.target.value);
        const features = await this.getFeaturesByCategoryId(this.state.addModal.categoryId);
        const stateFeatures = features.map(feature => ({
            featureId: feature.featureId,
            name: feature.name,
            value: '',
            use: 0,
        }));
        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                features: stateFeatures
            }),
        ));
    }

    private printAddModalFeatureInput(feature: any){
        return (
            <Form.Group>
                <Row>
                    <Col xs={4} sm={1} className='text-center'>
                        <input type='checkbox' value={1} checked={feature.use === 1} onChange={(e) => this.setAddModalFeatureUse(feature.featureId, e.target.checked)}/>
                    </Col>
                    <Col xs={8} sm={3}>
                        {feature.name}
                    </Col>
                    <Col xs={12} sm={8}>
                        <Form.Control type='text' value={feature.value} onChange={(e) => this.setAddModalFeatureValue(feature.featureId, e.target.value)} />
                    </Col>
                </Row>
            </Form.Group>
        );
    }

    private printEditModalFeatureInput(feature: any){
        return (
            <Form.Group>
                <Row>
                    <Col xs={4} sm={1} className='text-center'>
                        <input type='checkbox' value={1} checked={feature.use === 1} onChange={(e) => this.setEditModalFeatureUse(feature.featureId, e.target.checked)}/>
                    </Col>
                    <Col xs={8} sm={3}>
                        {feature.name}
                    </Col>
                    <Col xs={12} sm={8}>
                        <Form.Control type='text' value={feature.value} onChange={(e) => this.setEditModalFeatureValue(feature.featureId, e.target.value)} />
                    </Col>
                </Row>
            </Form.Group>
        );
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

                    <Card.Header className="d-flex justify-content-between align-items-center fs-4 fw-bold">
                        <span>
                            <FontAwesomeIcon icon={faListAlt} /> Articles
                        </span>
                        <Button variant="primary" onClick={() => this.showAddModal()}>
                            <FontAwesomeIcon icon={faPlus} /> NEW ARTICLE
                        </Button>
                    </Card.Header>
                    
                    <Card.Body className="py-5">
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
                                                <Link
                                                    to={"/administrator/dashboard/photo/" + article.articleId}
                                                    className='btn btn-sm btn-info ms-3'>
                                                    <FontAwesomeIcon icon={faImages} /> PHOTOS
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>

                </Card>

                <Modal size="lg" centered show = {this.state.addModal.visible} onHide={() => this.setAddModalVisibleState(false)} 
                        onEntered={() => {
                            const filePicker = document.getElementById('add-photo') as HTMLInputElement;
                            filePicker.value = '';
                        }}>
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
                                          onChange={(e) => this.addModalCategoryChanged(e as any)}>
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

                        <div>
                            {this.state.addModal.features.map(this.printAddModalFeatureInput, this)}
                        </div>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='add-photo'>Article photo</Form.Label>
                            <Form.Control id='add-photo' type='file'/>
                        </Form.Group>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='add-price'>Price</Form.Label>
                            <Form.Control id='add-price' type='number' min={0.01} step={0.01} value={this.state.addModal.price} 
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
                            <Form.Label htmlFor='edit-isPromoted'>Promoted</Form.Label>
                            <Form.Control id='edit-isPromoted' as='select' value={this.state.editModal.isPromoted.toString()} 
                                          onChange={(e) => this.setEditModalNumericFieldState('isPromoted', Number(e.target.value))}>
                                <option value={0}>NOT PROMOTED</option>
                                <option value={1}>PROMOTED</option>
                            </Form.Control>
                        </Form.Group>

                        <div>
                            {this.state.editModal.features.map(this.printEditModalFeatureInput, this)}
                        </div>

                        <Form.Group className='mt-2'>
                            <Form.Label htmlFor='edit-price'>Price</Form.Label>
                            <Form.Control id='edit-price' type='number' min={0.01} step={0.01} value={this.state.editModal.price} 
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
                            <FontAwesomeIcon icon={faSave}/> SAVE
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

    private setAddModalFeatureUse(featureId: number, use: boolean) {
        const addFeatures: {use: number; featureId: number;}[] = [...this.state.addModal.features];
        for (const feature of addFeatures) {
            if (feature.featureId === featureId) {
                feature.use = use ? 1 : 0;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                features: addFeatures
            }),
        ));
    }

    private setAddModalFeatureValue (featureId: number, value: string){
        const addFeatures: {featureId: number; value: string}[] = [...this.state.addModal.features];
        for (const feature of addFeatures) {
            if (feature.featureId === featureId) {
                feature.value = value;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.addModal, {
                features: addFeatures
            }),
        ));   
    }
    
    private showAddModal(){
        this.setAddModalStringFieldState('name', '');
        this.setAddModalNumericFieldState('categoryId', 1);
        this.setAddModalStringFieldState('excerpt', '');
        this.setAddModalStringFieldState('description', '');
        this.setAddModalNumericFieldState('price', 0.01);
        this.setAddModalStringFieldState('message', '');

        this.setState(Object.assign(this.state, Object.assign(this.state.addModal, {
            features: []
        })));

        this.setAddModalVisibleState(true);
    }

    private doAddArticle() {
        const filePicker = document.getElementById('add-photo') as HTMLInputElement;
    
        if (!filePicker || !filePicker.files || filePicker.files.length === 0) {
            this.setAddModalStringFieldState('message', 'You must select a file to upload!');
            return;
        }
    
        const file = filePicker.files[0];
    
        api('api/article/createFull', 'post', {
            name: this.state.addModal.name,
            categoryId: this.state.addModal.categoryId,
            excerpt: this.state.addModal.excerpt,
            description: this.state.addModal.description,
            price: Number(this.state.addModal.price),
            features: this.state.addModal.features
                .filter(feature => feature.use === 1)
                .map(feature => ({
                    featureId: feature.featureId,
                    value: feature.value
                })),
        }, 'administrator')
            .then(async (res: ApiResponse) => {
                if (res.status === "login") {
                    this.setLogginState(false);
                    return;
                }
                if (res.status === 'error') {
                    this.setAddModalStringFieldState('message', JSON.stringify(res.data));
                    return;
                }
    
                const articleId: number = res.data.articleId;
    
                await this.uploadArticlePhoto(articleId, file);
    
                this.setAddModalVisibleState(false);
                this.getArticles();
            });
    }
    

    private async uploadArticlePhoto (articleid: number, file: File){
        return await apiFile('api/article/' + articleid + '/uploadPhoto', 'photo', file, 'administrator');
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

    private setEditModalFeatureUse(featureId: number, use: boolean) {
        const editFeatures: {use: number; featureId: number;}[] = [...this.state.editModal.features];
        for (const feature of editFeatures) {
            if (feature.featureId === featureId) {
                feature.use = use ? 1 : 0;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                features: editFeatures
            }),
        ));
    }

    private setEditModalFeatureValue (featureId: number, value: string){
        const editFeatures: {featureId: number; value: string}[] = [...this.state.editModal.features];
        for (const feature of editFeatures) {
            if (feature.featureId === featureId) {
                feature.value = value;
                break;
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                features: editFeatures
            }),
        ));   
    }

    private async showEditModal(article: ArticleType){
        this.setEditModalStringFieldState('name', String(article.name));
        this.setEditModalNumericFieldState('articleId', article.articleId);
        this.setEditModalStringFieldState('excerpt', String(article.excerpt));
        this.setEditModalStringFieldState('description', String(article.description));
        this.setEditModalStringFieldState('status', String(article.status));
        this.setEditModalNumericFieldState('isPromoted', String(article.isPromoted));
        this.setEditModalNumericFieldState('price', article.price);
        this.setEditModalStringFieldState('message', '');

        if(!article.categoryId){
            return;
        }
        const categoryId: number = article.categoryId;
        const allFeatures: any[] = await this.getFeaturesByCategoryId(categoryId);
        for(const apiFeature of allFeatures){
            apiFeature.use = 0;
            apiFeature.value = '';
            if(article.articleFeatures){
                for(const articleFeature of article.articleFeatures){
                    if(articleFeature.featureId === apiFeature.featureId){
                        apiFeature.use = 1;
                        apiFeature.value = articleFeature.value;
                    }
                }
            }
        }

        this.setState(Object.assign(this.state, 
            Object.assign(this.state.editModal, {
                features: allFeatures
            }),
        )); 
        this.setEditModalVisibleState(true);
    }

    private doEditArticle(){
        api('api/article/' + this.state.editModal.articleId, 'patch', {
            name: this.state.editModal.name,
            excerpt: this.state.editModal.excerpt,
            description: this.state.editModal.description,
            status: this.state.editModal.status,
            isPromoted: Number(this.state.editModal.isPromoted),
            price: Number(this.state.editModal.price),
            features: this.state.editModal.features
                .filter(feature => feature.use === 1)
                .map(feature => ({
                    featureId: feature.featureId,
                    value: feature.value
                })) 
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