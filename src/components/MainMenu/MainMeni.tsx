import React from "react";
import { Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export class MainManuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string){
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties {
    items: MainManuItem[];
}

interface MainMenuState {
    items: MainManuItem[];
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
            <Container>
                <Nav variant="tabs">
                    {this.state.items.map((item, index) => (
                        <Nav.Item key={index}>
                            <Nav.Link as={Link} to={item.link}>
                                {item.text}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </Container>
        );
    }
}
