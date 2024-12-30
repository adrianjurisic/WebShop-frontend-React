import React from "react";
import CartType from "../../types/CartType";
import api, {ApiResponse} from '../../api/api';
import { Alert, Button, Form, Modal, Nav, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

interface CartState {
    count: number;
    cart?: CartType;
    visible: boolean;
    message: string;
    cartMenuColor: string;
}

export default class Cart extends React.Component {
    state: CartState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            count: 0,
            visible: false,
            message: '',
            cartMenuColor: '#000000'
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
        this.setState(Object.assign(this.state, {visible: newState}));
    }

    private setStateMessage(newMessage: string){
        this.setState(Object.assign(this.state, {message: newMessage}));
    }

    private setCartMenuColor(newColor: string){
        this.setState(Object.assign(this.state, {cartMenuColor: newColor}));
    }

    private showCart (){
        this.setStateVisible(true);
    }

    private hideCart(){
        this.setStateMessage('');
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
            if(!res.data.cartArticles.length){
                this.setStateCount(0);
            } else {
                this.setStateCount(res.data.cartArticles.length);
            }
            this.setCartMenuColor('#DC0000');
            setTimeout(()=> this.setCartMenuColor('#000000'), 2000);
        })
    }

    private calculateSum(): number {
        let sum: number = 0;
        if (this.state.cart) {
            for (const item of this.state.cart.cartArticles) {
                const price = item.article.articlePrices[item.article.articlePrices.length - 1].price;
                sum += price * item.quantity;
            }
        }
        return sum;
    }
    
    private sendCartUpdate(data: any){
        api('/api/user/cart/', 'patch', data)
        .then((res: ApiResponse) => {
            if(res.status === 'error' || res.status === 'login'){
                this.updateCart(); 
                return;
            }
            this.setStateCart(res.data);
            this.setStateCount(res.data.cartArticles.length);
        });
    }

    private updateQuantity(event: React.ChangeEvent<HTMLInputElement>){
        const articleId = Number(event.target.dataset.articleId);
        const newQuantity = Number(event.target.value);
        const updatedCart = { ...this.state.cart }; 
        if(updatedCart.cartArticles !== undefined){
            const cartArticle = updatedCart.cartArticles.find(item => item.article.articleId === articleId);
            
            if (cartArticle) {
                cartArticle.quantity = newQuantity;
            }
        } 
        this.setState({ cart: updatedCart });
        this.sendCartUpdate({
            articleId: articleId,
            quantity: newQuantity,
        });
    }

    private removeFromCart(articleId: number){
        this.sendCartUpdate({
            articleId: articleId,
            quantity: 0,
        })
    }
    
    private makeOrder(){
        api('/api/user/cart/makeOrder/', 'post', {})
        .then((res: ApiResponse) => {
            if(res.status === 'error' || res.status === 'login'){
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateMessage('Order sent! Thank You!');
            this.setStateCart(undefined);
            this.setStateCount(0);
        });
    }

    render() {
        const sum = this.calculateSum();
        return(
            <>
                <Nav.Item> 
                    <Nav.Link active={false} onClick={() => this.showCart()} style={{color: this.state.cartMenuColor}}>
                        <FontAwesomeIcon icon={faCartArrowDown} /> ({this.state.count})
                    </Nav.Link>
                    
                </Nav.Item>
                <Modal size="lg" centered show = {this.state.visible} onHide={() => this.hideCart()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.cart?.cartArticles.length && this.state.cart.cartArticles.length > 0 ? (
                        <>
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
                                            <td > 
                                                <Form.Control 
                                                    type="number" 
                                                    step={1} 
                                                    min={1} 
                                                    value={item.quantity} 
                                                    data-article-id = {item.article.articleId}
                                                    onChange={(e) => this.updateQuantity(e as any)}/>
                                            </td>
                                            <td> {Number(item.article.articlePrices[item.article.articlePrices.length - 1].price).toFixed(2)} BAM</td>
                                            <td> {Number(item.quantity * item.article.articlePrices[item.article.articlePrices.length - 1].price).toFixed(2)} BAM</td>
                                            <td>
                                                <FontAwesomeIcon icon={faMinusSquare}
                                                                 onClick={() => this.removeFromCart(item.article.articleId)} />
                                            </td>
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
                        </>
                        ) : (
                            <p>Your cart is empty!</p>
                        )}
                        <Alert variant="success" className={this.state.message ? '' : 'd-none'}>{this.state.message}</Alert>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button 
                        variant="primary" 
                        onClick={() => this.makeOrder()} 
                        disabled={!this.state.cart || this.state.cart.cartArticles.length === 0}
                    >
                        Make an order
                    </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}