import React from "react";
import CartType from "../../types/CartType";
import api, {ApiResponse} from '../../api/api';
import { Button, Modal, Nav, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";

interface CartState {
    count: number;
    cart?: CartType;
    visible: boolean;
}

export default class Cart extends React.Component {
    state: CartState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            count: 0,
            visible: false,
        }
    }

    private handleCartUpdate = () => this.updateCart();

    componentDidMount() {
        this.updateCart();
        window.addEventListener("cart.update", this.handleCartUpdate);
    }

    componentWillUnmount() {
        window.removeEventListener("cart.update", this.handleCartUpdate);
    }

    private setStateCount(newCount: number){
        this.setState(Object.assign(this.state, {count: newCount}));
    }

    private setStateCart (newCart?: CartType){
        this.setState(Object.assign(this.state, {cart: newCart}));
    }

    private setStateVisible(newState: boolean){
        this.setState(Object.assign(this.state, {visible: newState}))
    }

    private showCart (){
        this.setStateVisible(true);
    }

    private hideCart(){
        this.setStateVisible(false);
    }

    private updateCart(){
        api('api/user/cart/', 'get', {})
        .then((res: ApiResponse) => {
            if(res.status === 'error' || res.status === 'login'){
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateCart(res.data);
            console.log(res.data)
            if(!res.data.cartArticles.length){
                this.setStateCount(0);
            } else {
                this.setStateCount(res.data.cartArticles.length);
            }
        })
    }

    private calculateSum(): number {
        let sum: number = 0;
        if(this.state.cart){
            for(const item of this.state.cart?.cartArticles){
                sum += item.quantity * item.article.articlePrices[item.article.articlePrices.length - 1].price
            }
        }
        return sum;
    }

    render() {
        const sum = this.calculateSum();
        return(
            <>
                <Nav.Item> 
                    <Nav.Link active={false} onClick={() => this.showCart()}>
                        <FontAwesomeIcon icon={faCartArrowDown} /> ({this.state.count})
                    </Nav.Link>
                    
                </Nav.Item>
                <Modal size="lg" centered show = {this.state.visible} onHide={() => this.hideCart()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table hover size="sm">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Article</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.cart?.cartArticles.map(item => {
                                    return (
                                        <tr>
                                            <td> {item.article.category.name} </td>
                                            <td> {item.article.name} </td>
                                            <td > {item.quantity} </td>
                                            <td> {Number(item.article.articlePrices[item.article.articlePrices.length - 1].price).toFixed(2)} BAM</td>
                                            <td> {Number(item.quantity * item.article.articlePrices[item.article.articlePrices.length - 1].price).toFixed(2)} BAM</td>
                                            <td>...</td>
                                        </tr>
                                    )
                                }, this)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><strong>TOTAL:</strong></td>
                                    <td><strong>{Number(sum).toFixed(2)} BAM</strong></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary">
                            Make an order
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}