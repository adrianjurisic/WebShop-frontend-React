import { faListAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, Navigate, useParams } from 'react-router-dom';
import CategoryType from '../../types/CategoryType';
import api, { ApiResponse } from '../../api/api';
import ArticleType from '../../types/ArticleType';
import { ApiConfig } from '../../config/api.config';


interface CategoryPageState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
    filters?: {
        keywords: string;
        priceMin: number;
        priceMax: number;
        order: "name asc" | "name desc" | "price asc" | "price desc";
    }
}

interface ArticleDto {
    articleId: number;
    name: string;
    excerpt?: string;
    description?: string;
    articlePrices?: {
        price: number;
        createdAt: string;
    }[],
    photos?: {
        imagePath: string;
    }[],
}

function withRouter(Component: React.ComponentType<any>) {
    return (props: any) => {
        const params = useParams();
        return <Component {...props} params={params} />;
    };
}

class CategoryPage extends React.Component<{ params: { cId: string } }> {
    state: CategoryPageState;

    constructor(props: { params: { cId: string } }) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
            filters: {
                keywords: '',
                priceMin: 0.01,
                priceMax: 100000,
                order: "price asc",
            }
        };
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState({
            isUserLoggedIn: isLoggedIn,
        });
    }

    private setMessage(message: string) {
        this.setState({
            message: message,
        });
    }

    private setCategoryData(category: CategoryType) {
        this.setState({
            category: category,
        });
    }

    private setSubcategories(subcategories: CategoryType[]) {
        this.setState({
            subcategories: subcategories,
        });
    }

    private setArticles(articles: ArticleType[]) {
        this.setState({
            articles: articles,
        });
    }

    private printOptionalMessage() {
        if (this.state.message === '') {
            return null;
        }
        return <Card.Text>{this.state.message}</Card.Text>;
    }

    private showSubcategories(){
        if(this.state.subcategories?.length === 0){
            return;
        }
        return (
            <Row>
                {this.state.subcategories?.map(this.singleCategory)}
            </Row>
        );
    }

    private singleCategory(category: CategoryType) {
        return(
            <Col lg="3" md="4" sm="6" xs="12">
                <Card className='mb-3'>
                    <Card.Body>
                        <Card.Title as='p'>
                            {category.name}
                        </Card.Title>
                        <Link to={`/category/${category.categoryId}`} className='btn btn-primary btn-block btn-sm'>
                            Open category
                        </Link>

                    </Card.Body>
                </Card>
            </Col>
        );
    }

    private showArticles(){
        if(this.state.articles?.length === 0){
            return(
                <div>There are no articles in this category!</div>
            );
        }
        return(
            <Row>
                { this.state.articles?.map(this.singleArticle) }
            </Row>
        )
    }

    private singleArticle (article: ArticleType){
        return (
            <Col lg="4" md="6" sm="6" xs="12">
                <Card className='mb-3'>
                    <Card.Header>
                        <img alt= {article.name} 
                             src={ApiConfig.PHOTO_PATH + 'small/' + article.imageUrl}
                             className='w-100' />
                    </Card.Header>
                    <Card.Body>
                        <Card.Title as='p'>
                            <strong>{article.name}</strong>
                        </Card.Title>
                        <Card.Text>
                            {article.excerpt}
                        </Card.Text>
                        <Card.Text>
                            Price: {Number(article.price).toFixed(2)} BAM
                        </Card.Text>
                        <Link to={`/article/${article.articleId}`} className='btn btn-primary btn-block btn-sm'>
                            Show article
                        </Link>

                    </Card.Body>
                </Card>
            </Col>
        )
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return <Navigate to="/user/login" />;
        }

        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt} /> {this.state.category?.name || 'Select a category'}
                        </Card.Title>
                        {this.printOptionalMessage()}
                        {this.showSubcategories()}
                        <Row>
                            <Col xs="12" md="4" lg="3">
                                {this.printFilters()}
                            </Col>
                            <Col xs="12" md="8" lg="9">
                                {this.showArticles()}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private setNewFilter(newFilter: any){
        this.setState(Object.assign(this.state, {
            filters: newFilter,
        }));
    }

    private filterKeywordsChanged(event: React.ChangeEvent<HTMLInputElement>){
        this.setNewFilter(Object.assign({}, this.state.filters, {
            keywords: event.target.value,
        }));
    }

    private filterPriceMinChanged(event: React.ChangeEvent<HTMLInputElement>){
        this.setNewFilter(Object.assign({}, this.state.filters, {
            priceMin: Number(event.target.value),
        }));
    }

    private filterPriceMaxChanged(event: React.ChangeEvent<HTMLInputElement>){
        this.setNewFilter(Object.assign({}, this.state.filters, {
            priceMax: Number(event.target.value),
        }));
    }

    private filterOrderChanged(event: React.ChangeEvent<HTMLSelectElement>){
        this.setNewFilter(Object.assign({}, this.state.filters, {
            order: event.target.value,
        }));
    }

    private applyFilters(){
        this.getCategoryData();
    }

    private printFilters(){
        return(
            <>
                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='keywords'>Search keywords:</Form.Label>
                    <Form.Control type='text' id='keywords' value={this.state.filters?.keywords} onChange={(e) => this.filterKeywordsChanged(e as any)}/>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Row>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor='priceMin'>Min price:</Form.Label>
                            <Form.Control type='number' id='priceMin' step="0.01" min={0.01} max={99999.99} value={this.state.filters?.priceMin} onChange={(e) => this.filterPriceMinChanged(e as any)}/>
                        </Col>
                        <Col xs="12" sm="6">
                            <Form.Label htmlFor='priceMax'>Max price:</Form.Label>
                            <Form.Control type='number' id='priceMax' step="0.01" min={0.02} max={100000} value={this.state.filters?.priceMax} onChange={(e) => this.filterPriceMaxChanged(e as any)}/>
                        </Col>
                    </Row>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Control as="select" id='sortOrder' value={this.state.filters?.order} onChange={(e) => this.filterOrderChanged(e as any)}>
                        <option value="name asc">Sort by name- ascending</option>
                        <option value="name desc">Sort by name- descending</option>
                        <option value="price asc">Sort by price- ascending</option>
                        <option value="price desc">Sort by price- descending</option>
                    </Form.Control> 
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Button variant="primary" className='w-100' onClick={() => this.applyFilters()}>
                        <FontAwesomeIcon icon={faSearch} />Search
                    </Button>
                </Form.Group>
            </>
        );
    }

    componentDidMount() {
        this.getCategoryData();
    }

    componentDidUpdate(oldProps: { params: { cId: string } }) {
        if (oldProps.params.cId === this.props.params.cId) {
            return;
        }
        this.getCategoryData();
    }

    private getCategoryData() {
        const { cId } = this.props.params;
    
        api('api/category/' + cId, 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    return this.setLogginState(false);
                }
    
                if (res.status === 'error') {
                    return this.setMessage('Request error. Try to refresh!');
                }
    
                const categoryData: CategoryType = {
                    categoryId: res.data.categoryId,
                    name: res.data.name,
                };
    
                this.setCategoryData(categoryData);
    
                const subcategories: CategoryType[] = [];
                const categories = res.data.categories || []; 
    
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    subcategories.push({
                        categoryId: category.categoryId,
                        name: category.name,
                    });
                }
    
                this.setSubcategories(subcategories);
            });

            const orderParts = this.state.filters?.order.split(' ');
            let orderBy = 'price';
            let orderDirection = 'asc';
            if(orderParts){
                orderBy = orderParts[0];
                orderDirection = orderParts[1].toUpperCase();
            }
            
            api('api/article/search', 'post', {
                categoryId : Number(this.props.params.cId),
                keywords: this.state.filters?.keywords,
                priceMin: this.state.filters?.priceMin,
                priceMax: this.state.filters?.priceMax,
                features: [ ],
                orderBy: orderBy,
                orderDirection: orderDirection,
            })
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    return this.setLogginState(false);
                }
    
                if (res.status === 'error') {
                    return this.setMessage('Request error. Try to refresh!');
                }

                if(res.data.statusCode === 0){
                    this.setMessage('');
                    this.setArticles([]);
                    return;
                }
                
                const articles: ArticleType[] = res.data.map((article: ArticleDto) => {
                    const object: ArticleType = {
                        articleId: article.articleId,
                        name: article.name,
                        excerpt: article.excerpt,
                        description: article.description,
                        imageUrl: '',
                        price: 0,
                    };

                    if(article.photos !== undefined && article.photos?.length > 0){
                        object.imageUrl = article.photos[article.photos?.length-1].imagePath;
                    }

                    if(article.articlePrices !== undefined && article.articlePrices?.length > 0){
                        object.price = article.articlePrices[article.articlePrices?.length-1].price;
                    }

                    return object;
                 });
                 this.setArticles(articles);
            });
    }
    
}

export default withRouter(CategoryPage);