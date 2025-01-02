import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import { Card, Col, Container, Row } from 'react-bootstrap';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { ApiConfig } from '../../config/api.config';
import AddToCartInput from '../AddToCartInput/AddToCartInput';

interface FeatureData {
    name: string;
    value: string;
}

interface ArticlePageState {
    isUserLoggedIn: boolean;
    message: string;
    article?: ApiArticleDto;
    features?: FeatureData[];
}

function withRouter(Component: React.ComponentType<any>) {
    return (props: any) => {
        const params = useParams();
        return <Component {...props} params={params} />;
    };

}

class ArticlePage extends React.Component<{ params: { aId: string } }> {
    state: ArticlePageState;

    constructor(props: { params: { aId: string } }) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            message: '',
            article: undefined,
            features: [],
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

    private setArticle(article: ApiArticleDto | undefined) {
        this.setState({
            article: article,
        });
    }
    private setFeatures(features: FeatureData[]) {
        this.setState({
            features: features,
        });
    }

    componentDidMount() {
        this.getArticleData();
    }

    componentDidUpdate(oldProps: { params: { aId: string } }) {
        if (oldProps.params.aId === this.props.params.aId) {
            return;
        }
        this.getArticleData();
    }

    private getArticleData() {
        const { aId } = this.props.params;
    
        api('api/article/' + aId, 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    return this.setLogginState(false);
                }
    
                if (res.status === 'error') {
                    this.setArticle(undefined);
                    this.setFeatures([]);
                    this.setMessage('Article does not exist!');
                    return;
                }

                const data: ApiArticleDto = res.data;

                this.setMessage('');
                this.setArticle(data);

                const features: FeatureData[] = [];

                for (const articleFeature of data.articleFeatures) {
                    const value = articleFeature.value;
                    let name = '';
    
                    for (const feature of data.features) {
                        if (feature.featureId === articleFeature.featureId) {
                            name = feature.name;
                        }
                    }
                    features.push({ name, value });
                }

                this.setFeatures(features);
            });
    }
    

    render(){
        if (this.state.isUserLoggedIn === false) {
            return <Navigate to="/user/login" />;
        }
        
        return (
            <Container>
                <RolledMainMenu role='user'/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <strong className='h3'>
                                <FontAwesomeIcon icon={faBoxOpen}/> {this.state.article?.name}
                            </strong>
                        </Card.Title>
                        {this.printOptionalMessage()}

                        {
                            this.state.article ?
                            ( this.renderArticleData(this.state.article) ) :
                            ''
                        }
                    </Card.Body>
                </Card>
            </Container>
        );        
    }

    renderArticleData(article: ApiArticleDto) {
        return (
            <Row>
                <Col xs="12" lg="8">
                    <div className="excerpt">
                        <strong>Excerpt: </strong><br/>
                        {article.excerpt}
                    </div>

                    <hr/>

                    <div className="description">
                        <strong>Description: </strong><br/>
                        {article.description}
                    </div>

                    <hr/>                    

                    <b>Features:</b><br />

                    <ul>
                        {
                            this.state.features && this.state.features.length > 0 ? (
                                this.state.features.map((feature, index) => (
                                    <li key={index}>
                                        {feature.name}: {feature.value}
                                    </li>
                            ))
                        ) : (
                            <li>No features available</li>
                        )
                        }
                    </ul>
                </Col>

                <Col xs="12" lg="4">
                    <Row>
                        <Col xs="12" className="mb-3">
                            <img alt={ 'Image - ' + article.photos[0].photoId }
                                    src={ ApiConfig.PHOTO_PATH + 'small/' + article.photos[0].imagePath }
                                    className="w-100" />
                        </Col>
                    </Row>

                    <Row>
                        { article.photos.slice(1).map(photo => (
                            <Col xs="12" sm="6">
                                <img alt={ 'Image - ' + photo.photoId }
                                        src={ ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath }
                                        className="w-100 mb-3" />
                            </Col>
                        ), this) }
                    </Row>

                    <Row>
                        <Col xs="12" className="text-center mb-3">
                            <b>
                                Price: { Number(article.articlePrices[article.articlePrices.length-1].price).toFixed(2) + ' EUR' }
                            </b>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="12" className="mt-2 mb-3 d-flex justify-content-end">
                            <AddToCartInput article={ article } />
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }

    private printOptionalMessage(){
        if (this.state.message === '') {
            return null;
        }
        return <Card.Text>{this.state.message}</Card.Text>;        
    }
    
}

export default withRouter(ArticlePage);
