import React from "react";
import { Container, Nav } from "react-bootstrap";

export class MainManuItem {
    text: string = '';
    link: string = '#';

    constructor(text: string, link: string){
        this.text = text;
        this.link = link;
    }
}

interface MainMenuProperties{
    items: MainManuItem[];
}

export class  MainMenu extends React.Component<MainMenuProperties> {
    render(){
        return (
            <Container>
                <Nav variant="tabs">
                    { this.props.items.map(this.makeNavLink) }
                </Nav>
            </Container>
        );
    }

    private makeNavLink (item: MainManuItem){
        return (
            <Nav.Link href={item.link}>
                {item.text}
            </Nav.Link>
        );
    }
}