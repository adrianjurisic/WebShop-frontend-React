import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import ArticleType from '../../types/ArticleType';
import api, { ApiResponse } from '../../api/api';

interface AddToCartInputProperties {
    article: ArticleType,
}

interface AddToCartInputState {
    quantity: number;
}

export default class AddToCartInput extends React.Component<AddToCartInputProperties> {
    state: AddToCartInputState;

    constructor(props: Readonly<AddToCartInputProperties>) {
        super(props);

        this.state = {
            quantity: 1,
        }
    }

    private quantityChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            quantity: Number(event.target.value),
        });
    }

    private addToCart() {
        const data = {
            articleId: this.props.article.articleId,
            quantity: this.state.quantity,
        };

        api('/api/user/cart/addToCart/', 'post', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return;
            }

            window.dispatchEvent(new CustomEvent('cart.update'));
        });
    }

    render() {
        return (
            <Form.Group>
                <Row>
                    <Col xs="7">
                        <Form.Control type="number" min="1" step="1" value={ this.state.quantity }
                                        onChange={ (e) => this.quantityChanged(e as any) } />
                    </Col>
                    <Col xs="5">
                        <Button variant="primary"
                                onClick={ () => this.addToCart() }>
                            Buy
                        </Button>
                    </Col>
                </Row>
            </Form.Group>
        );
    }
}