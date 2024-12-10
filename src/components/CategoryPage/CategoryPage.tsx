import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link, Navigate, useParams } from 'react-router-dom';
import CategoryType from '../../types/CategoryType';
import api, { ApiResponse } from '../../api/api';
import ArticleType from '../../types/ArticleType';


interface CategoryPageState {
    isUserLoggedIn: boolean;
    category?: CategoryType;
    subcategories?: CategoryType[];
    articles?: ArticleType[];
    message: string;
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

    private printOptionalMessage() {
        if (this.state.message === '') {
            return null;
        }
        return <Card.Text>{this.state.message}</Card.Text>;
    }

    private showSubcategories(){
        if(this.state.subcategories?.length === 0){
            return(
                <Row>
                    Nema podkategorija
                </Row>
            )
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
                    </Card.Body>
                </Card>
            </Container>
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
            })
            .catch((error) => {
                console.error('API error:', error);
                this.setMessage('An error occurred. Please try again later.');
            });
    }
    
}

export default withRouter(CategoryPage);
