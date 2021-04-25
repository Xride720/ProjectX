import React, { Component } from 'react';
import Button from '../../Button/Button';
import './entryStyle.css';
import CommonClass from '../../../WorkClass/CommonClass';
import { NavLink, useLocation } from 'react-router-dom';
import {sendEnterFormEnd, 
        sendEnterFormStart,
        authChangeLogin,
        personalAreaSetStartValue} from '../../../redux/actions/authActions';
const CC = new CommonClass();

export default class Entry extends Component {
    constructor(props) {
        super(props);

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.sendEnter = this.sendEnter.bind(this);
    }

    componentDidMount() {
               
    }

    handleChangeEmail(event) {
        this.props.dispatch({
            type: 'CHANGE_ENTER_FORM_EMAIL',
            newData: event.target.value
        });
    }
    handleChangePass(event) {
        this.props.dispatch({
            type: 'CHANGE_ENTER_FORM_PASS',
            newData: event.target.value
        });
    }

    async handleClick(event) {
        console.log(this.props.state);
        this.props.dispatch(sendEnterFormStart());
        const resp = await CC.request('/api/auth', 'POST', this.props.state);
        console.log(resp);
        this.props.dispatch(sendEnterFormEnd(resp, this.props.history, 1));
        this.props.dispatch(personalAreaSetStartValue(resp));
        
        setTimeout(() => {
            this.props.dispatch(sendEnterFormEnd(resp, this.props.history, 2));
            this.props.dispatch(authChangeLogin(resp));
        }, resp.success ? 1500 : 1000);
        
        // if (resp.success) {

        //     document.querySelector('.enter__form-container').style.display = "none";
        //     document.querySelector('.enter__form .success__auth').style.display = "block";
        //     let cut_data = {
        //         login: resp.data.login,
        //         email: resp.data.email,
        //         id: resp.data.id
        //     };
        //     setTimeout(() => {
        //         document.querySelector('.personal__wrap .change__data').value = JSON.stringify(cut_data);
        //         document.querySelector('.personal__wrap .change__data').dataset.prevValue = JSON.stringify(cut_data);
        //         document.querySelector('.personal__wrap .change__data').dispatchEvent(new InputEvent('change'));
        //         
        //     }, 1500);
        // } else {
        //     document.querySelector('.enter__form .error__auth').style.opacity = "1";
        //     CC.errorEl(document.querySelector('.enter__form-container .enter__email input'));
        //     CC.errorEl(document.querySelector('.enter__form-container .enter__password input'));
        //     CC.errorEl(document.querySelector('.enter__form-container .enter__btn'));
        //     setTimeout(() => {
        //         document.querySelector('.enter__form .error__auth').style.opacity = "0";
        //     }, 1000);
        // }
    }

    sendEnter(e) {
        if (e.key == 'Enter') {
            console.log(e.key);
            this.handleClick({});
        }
    }

    render() {
        let enter_visible = '', success_visible = ' hidden ';
        if (this.props.state.success_auth) {
            enter_visible = ' hidden ';
            success_visible = '';
        }
        let error_text_visible = this.props.state.error_auth ? ' visible ' : '',
            err_block = this.props.state.error_auth ? 'error' : '';

        let loader_visible = this.props.state.loader ? '' : ' hidden ';
        return (
            <div>
                <div className={"success__auth " + success_visible}>Вы вошли!</div>
                <div className={"loader " + loader_visible}></div>
                    <div className={"enter__form-container " + enter_visible}
                        onKeyDown={this.sendEnter}>
                        <div className={"error__auth " + error_text_visible}>Неверный E-mail или пароль</div>                        
                        <div className="enter__email">
                            <label>E-mail:</label>
                            <input type="text" data-id="email" className={"input__field " + err_block}
                                value={this.props.state.email}
                                onChange = {this.handleChangeEmail}
                            />
                        </div>
                        <div className="enter__password">
                            <label>Пароль:</label>
                            <input type="password" data-id="password" name="password" className={"input__field " + err_block}
                                value={this.props.state.password}
                                onChange = {this.handleChangePass}
                            />
                        </div>

                        <Button text="Войти" type="enter_btn" handler={this.handleClick} err={err_block}/>
                        
                        <div className = "enter__other">
                            <NavLink to="/entry/registration" className="other__registration">Регистрация</NavLink>
                            <NavLink to="/entry/forgot_pass" className="other__forgot-pass">Забыли пароль?</NavLink>
                        </div>
                    </div>  

            </div>
        )
    }
}