import React, { Component } from 'react';
import AppBarNav from './AppBarNav/AppBarNav';
import './AppBarStyle.css';
import CommonClass from '../../WorkClass/CommonClass';
import Button from '../Button/Button';
import {authChangeQuit} from '../../redux/actions/authActions';
const CC = new CommonClass();

export default class AppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {


        };
        this.logout = this.logout.bind(this);
        this.openPersonalArea = this.openPersonalArea.bind(this);
    }

    logout() {
        this.props.dispatch(authChangeQuit());
    } 

    openPersonalArea(e) {
        this.props.dispatch({
            type: 'OPEN_PA',
            stage: 1
        });
        setTimeout(() => {
            this.props.dispatch({
                type: 'OPEN_PA',
                stage: 2
            });
        });
        // e.target.closest('.App').querySelector('.personal__wrap').style.display = 'flex';
        // setTimeout(() => {e.target.closest('.App').querySelector('.personal__wrap').classList.add('visible')});
        
    }

    render() {
        let is_auth = this.props.state.is_auth;
        return (
            <div className="appbar__cont">
                <AppBarNav />
                <div className="auth__block">
                    <Button text="Личный кабинет" 
                            type="p-area__btn" 
                            handler={this.openPersonalArea}
                            hidden={!(is_auth)}
                            />
                    <Button text="Войти" 
                            type="login__btn"
                            hidden={is_auth} />
                    
                    <div className={"auth__block-info " + (is_auth ? '' : ' hidden')}>
                        <p className="auth__name">Вы вошли как: <span className="name">{this.props.state.login}</span></p>
                        <Button text="Выход" type="logout__btn" handler={this.logout}/>
                    </div>                     
                </div>
                
            </div>
        )
    }
}