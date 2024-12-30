import React from "react";
import { Navigate } from "react-router-dom";
import { removeTokenData } from "../../api/api";

interface UserLogoutPageState {
    done: boolean;
}

export class UserLogoutPage extends React.Component {
    state: UserLogoutPageState;

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
            return <Navigate to="/user/login/" />
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
            removeTokenData('user');
            this.finished();
        }
    }
}