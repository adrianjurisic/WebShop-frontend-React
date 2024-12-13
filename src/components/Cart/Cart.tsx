import React from "react";
import CartType from "../../types/CartType";
import api, {ApiResponse} from '../../api/api';
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";

interface CartState {
    count: number;
    cart?: CartType;
}

export default class Cart extends React.Component {
    state: CartState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            count: 0,
        }
    }

    componentDidMount() {
        this.updateCart();

        window.addEventListener("cart.update", this.updateCart);
    }

    componentWillUnmount() {
        window.removeEventListener("cart.update", this.updateCart);
    }

    private setStateCount(newCount: number){
        this.setState(Object.assign(this.state, {count: newCount}));
    }

    private setStateCart (newCart?: CartType){
        this.setState(Object.assign(this.state, {cart: newCart}));
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
            console.log(res.data.cartArticles.lenght)
            if(!res.data.cartArticles.lenght){
                this.setStateCount(0);
            } else {
                this.setStateCount(res.data.cartArticles.lenght);
            }
        })
    }

    render() {
        return(
            <Nav.Item> 
                <Nav.Link active={false}>
                    <FontAwesomeIcon icon={faCartArrowDown} /> ({this.state.count})
                </Nav.Link>
                
            </Nav.Item>
        );
    }
}