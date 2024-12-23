import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";

export class MainMenuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string){
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties {
    items: MainMenuItem[];
    showCart?: boolean;
}

interface MainMenuState {
    items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainMenuProperties, MainMenuState> {
    constructor(props: MainMenuProperties) {
        super(props);

        this.state = {
            items: props.items,
        };
    }

    render() {
        return (
            <Nav variant="tabs">
                {this.state.items.map((item, index) => (
                    <Nav.Item key={index}>
                        <Nav.Link as={Link} to={item.link}>
                            {item.text}
                        </Nav.Link>
                    </Nav.Item>
                ))}
                {this.props.showCart ? <Cart/> : ''}
            </Nav>
        );
    }
}
