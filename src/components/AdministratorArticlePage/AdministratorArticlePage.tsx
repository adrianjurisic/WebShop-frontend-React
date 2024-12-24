import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import ArticleType from '../../types/ArticleType';
import ApiArticleDto from '../../dtos/ApiArticleDto';

interface AdministratorArticlePageState {
    isAdministratorLoggedIn: boolean;
    articles: ArticleType[];
}

class AdministratorArticlePage extends React.Component {
    state: AdministratorArticlePageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            articles: [],
        };
    }

    componentDidMount() {
        this.getArticles();
    }

    componentDidUpdate() {
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
                price: article.articlePrices[article.articlePrices.length-1].price,
            };
        });

        const newState = Object.assign(this.state, {
            articles: articles,
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
                            <FontAwesomeIcon icon={ faListAlt } /> Articles
                        </Card.Title>
                        <Table hover size='sm' bordered>
                            <thead>
                                <tr>
                                    <th className='text-right'>Article ID</th>
                                    <th>Name</th>
                                    <th className='text-right'>Price</th>
                                    <th>Excerpt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.articles.map(article => (
                                    <tr>
                                        <td className='text-right'>{article.articleId}</td>
                                        <td>{article.name}</td>
                                        <td className='text-right'>{article.price}</td>
                                        <td>{article.excerpt}</td>
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

export default AdministratorArticlePage;