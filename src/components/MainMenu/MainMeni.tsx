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

interface MainMenuState{
    items: MainManuItem[];
}

export class  MainMenu extends React.Component<MainMenuProperties> {
    state: MainMenuState; 

    constructor(props: MainMenuProperties){
        super(props);

        this.state = {
            items: props.items,
        };
    }

    setItems(items: MainManuItem[]){
        this.setState({
            items: items,
        });
    }

    render(){
        return (
            <Container>
                <Nav variant="tabs">
                    { this.state.items.map(this.makeNavLink) }
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