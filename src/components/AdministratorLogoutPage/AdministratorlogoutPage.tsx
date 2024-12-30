import React from "react";
import { Navigate } from "react-router-dom";
import { removeTokenData } from "../../api/api";

interface AdministratorLogoutPageState {
    done: boolean;
}

export class AdministratorLogoutPage extends React.Component {
    state: AdministratorLogoutPageState;

    constructor(props: Readonly<{}>){
        super(props);

        this.state = {
            done: false,
        };
    }

    finished(){
        this.setState({
            done: true
        });
    } 

    render(){
        if(this.state.done){
            return <Navigate to="/administrator/login/" />
        }

        return(
            <p>Logging out...</p>
        );
    }

    componentDidMount(){
        this.doLogout();
    }

    doLogout(){
        if (!this.state.done) {
            removeTokenData('administrator');
            this.finished();
        }
    }
}