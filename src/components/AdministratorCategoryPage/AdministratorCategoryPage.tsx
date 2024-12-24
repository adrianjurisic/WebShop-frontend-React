import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate } from 'react-router-dom';
import api, {ApiResponse} from '../../api/api';
import RolledMainMenu from '../RoledMainMenu/RoledMainMenu';
import CategoryType from '../../types/CategoryType';
import ApiCategoryDto from '../../dtos/ApiCategoryDto';

interface AdministratorCategoryPageState {
    isAdministratorLoggedIn: boolean;
    categories: CategoryType[];
}

class AdministratorCategoryPage extends React.Component {
    state: AdministratorCategoryPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
            categories: [],
        };
    }

    componentDidMount() {
        this.getCategories();
    }

    componentDidUpdate() {
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
                <RolledMainMenu role='administrator'/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faListAlt } /> Categories
                        </Card.Title>
                        <Table hover size='sm' bordered>
                            <thead>
                                <tr>
                                    <th className='text-right'>ID</th>
                                    <th>Name</th>
                                    <th className='text-right'>Parent ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.categories.map(category => (
                                    <tr>
                                        <td className='text-right'>{category.categoryId}</td>
                                        <td>{category.name}</td>
                                        <td className='text-right'>
                                            {category.parentCategoryId !== undefined && category.parentCategoryId !== null
                                            ? category.parentCategoryId
                                            : '-'}
                                        </td>
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

export default AdministratorCategoryPage;