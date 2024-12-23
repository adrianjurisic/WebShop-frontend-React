import React from "react";
import { MainMenu, MainMenuItem } from "../MainMenu/MainMeni";

interface RolledMainMenuProperties {
    role: 'user' | 'administrator' | 'guest';
}

export default class RolledMainMenu extends React.Component<RolledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];
        switch(this.props.role){
            case 'guest': items = this.getGuestMenuItems(); break;
            case 'administrator': items = this.getAdministratorMenuItems(); break;
            case 'user': items = this.getUserMenuItems(); break;
        }

        let showCart = false;
        if(this.props.role === 'user'){
            showCart = true;
        }
        return <MainMenu items = {items} showCart={showCart}/>
    }

    getUserMenuItems(): MainMenuItem[]{
        return [
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Contact", "/contact"),
            new MainMenuItem("My Orders", "/user/orders"),
            new MainMenuItem("Log out", "/user/logout/"),
        ];
    }

    getAdministratorMenuItems(): MainMenuItem[]{
        return [
            new MainMenuItem("Dashboard", "/administrator/dashboard/"),
            new MainMenuItem("Log out", "/administrator/logout/"),
        ];
    }

    getGuestMenuItems(): MainMenuItem[]{
        return [
            new MainMenuItem("Administrator Login", "/administrator/login"),
            new MainMenuItem("User Login", "/user/login"),
            new MainMenuItem("Register", "/user/register"),
        ];
    }

}