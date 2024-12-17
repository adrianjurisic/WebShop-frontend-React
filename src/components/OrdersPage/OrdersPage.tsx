import React, { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS } from 'react';
import { Navigate } from 'react-router-dom';
import OrderType from '../../types/OrderType';
import api, {ApiResponse} from '../../api/api';
import { Card, Container, Row, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';

interface OrderPageState {
    isUserLoggedIn: boolean;
    orders: OrderType[];
}

interface OrderDto {
    orderId: number;
    createdAt: string;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: {
        cartId: number;
        createdAt: string;
        cartArticles: {
            quantity: number;
            article: {
                articleId: number;
                name: string;
                excerpt: string;
                status: "available" | "visible" | "hidden";
                isPromoted: number;
                category: {
                    categoryId: number;
                    name: string;
                };
                articlePrices: {
                    price: number;
                }[];
                photos: {
                    imagePath: string;
                }[];
            };
        }[];
    };
}

export default class OrderPage extends React.Component {
    state: OrderPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isUserLoggedIn: true,
            orders: [],
        };
    }

    private setLogginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn
        }));
    }

    private setOrdersState(orders: OrderType[]) {
        this.setState(Object.assign(this.state, {
            orders: orders
        }));
    }

    componentDidMount() {
        this.getOrders();
    }

    componentDidUpdate() {
        this.getOrders();
    }

    private getOrders(){
        api('/api/user/cart/oders/', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
            const data: OrderDto[] = res.data;
            const orders: OrderType[] = data.map(order => ({
                orderId: order.orderId,
                status: order.status,
                createdAt: order.createdAt,
                cart: {
                    cartId: order.cart.cartId,
                    userId: 0,
                    createdAt: order.cart.createdAt,
                    user: null,
                    cartArticles: order.cart.cartArticles.map(ca => ({
                        cartArticleId: 0,
                        articleId: ca.article.articleId,
                        quantity: ca.quantity,
                        article: {
                            articleId: ca.article.articleId,
                            name: ca.article.name,
                            category: {
                                categoryId: ca.article.category.categoryId,
                                name: ca.article.category.name,
                            },
                            articlePrices: ca.article.articlePrices.map(ap => ({
                                articlePriceId: 0,
                                price: ap.price,
                            })),
                        }
                    })),
                }
            }));

            this.setOrdersState(orders);
        })
    }

    render() {
        if (this.state.isUserLoggedIn === false) {
            return (
                <Navigate to="/user/login" />
            );
        }

        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faBox } /> My Orders
                        </Card.Title>
                        <Table hover size='sm'>
                            <thead>
                                <tr>
                                    <th>Created at</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.orders.map(this.printOrderRow)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printOrderRow(order: OrderType){
        return (
            <tr>
                <td>{order.createdAt}</td>
                <td>{order.status}</td>
                <td>...</td>
            </tr>
        );
    }
}