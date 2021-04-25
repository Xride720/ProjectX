import React, { Component } from 'react';
import './PersonalAreaStyle.css';
import {changeBlockInput, 
        changeSaveBlock, 
        backToPrevEmail,
        changeUserDataError,
        changeUserDataErrorPassword,
        changeUserDataSuccess,
        changeUserDataErrorEmail} from '../../redux/actions/personalAreaActions';
import CommonClass from '../../WorkClass/CommonClass';
const CC = new CommonClass();

export default class PersonalArea extends Component {
    constructor(props) {
        super(props);

        this.componentDidMount = this.componentDidMount.bind(this);
        this.changeInputBlock = this.changeInputBlock.bind(this);
        this.saveAccountChange = this.saveAccountChange.bind(this);
        this.closePersonalArea = this.closePersonalArea.bind(this);
        this.changeSaveBlockPass = this.changeSaveBlockPass.bind(this);
        this.backToPrevEmail = this.backToPrevEmail.bind(this);
    }
    componentDidMount() {
    }

    changeInputBlock(e) {
        console.log(this.props.state);
        let field = '';
        if (e.target.matches('.login__input')) field = 'login';
        else if (e.target.matches('.email__input')) field = 'email';
        else if (e.target.matches('.password__cont .password__input')) field = 'password';
        else if (e.target.matches('.password-repeat__cont .password__input')) field = 'repeat_password';

        if (field != '')
            this.props.dispatch(changeBlockInput(e.target.value, field));
    }

    async saveAccountChange(e) {  
        if (this.props.state.save_block.disable) return;   
        
        let req_body = {
            old_email : this.props.state.prev_value.email,
            pass: this.props.state.save_block.old_password,
            new_pass: this.props.state.current_value.password,
            login: this.props.state.current_value.login,
            email: this.props.state.current_value.email,
        };
        console.log(req_body);
        const resp = await CC.request('/api/change_user', 'POST', req_body);
        console.log(resp);
        if (resp.success) {
            this.props.dispatch(changeUserDataSuccess(1));

            setTimeout(() => {
                this.props.dispatch(changeUserDataSuccess(2));               
            }, 1500);
        } else {
            console.log(resp.error);
            if (resp.error_type == 1) {
                this.props.dispatch(changeUserDataErrorEmail(1)); 
                let promise = new Promise (resolve => { 
                    setTimeout(() => {
                        this.props.dispatch(changeUserDataErrorEmail(2));
                        resolve();              
                    }, 1000);
                });
                promise.then(result => {
                    setTimeout(() => {
                        this.props.dispatch(changeUserDataErrorEmail(3));
                    }, 500);                 
                });            
            } else if (resp.error_type == 2) {
                this.props.dispatch(changeUserDataError(1));  
                setTimeout(() => {
                    this.props.dispatch(changeUserDataError(2));             
                }, 1500);
            } else if (resp.error_type == 3) {
                this.props.dispatch(changeUserDataErrorPassword());  
            }
        }
    }

    closePersonalArea(e) {
        if (!e.target.closest('.p-area__cont') || e.target.closest('.p-area__cont .close__btn')) {
            this.props.dispatch({
                type: 'CLOSE_PA'
            });
        }
    }

    changeSaveBlockPass(e) {
        this.props.dispatch(changeSaveBlock(e.target.value, 'old_password'));
    }

    backToPrevEmail(e) {
        if (this.props.state.current_value.email == '') {
            this.props.dispatch(backToPrevEmail());
        }
    }

    render() {
        let pa_visible = this.props.state.visible ? ' visible ' : '',
            pre_pa_visible = this.props.state.pre_visible ? ' pre-visible ' : '',
            save_disable = this.props.state.save_block.disable,
            save_disable_class = save_disable ? ' disable ' : '',
            valid_password_class = this.props.state.current_value.valid_password_class,
            valid_password_text = this.props.state.current_value.valid_password_text,
            error_email_class = this.props.state.current_value.valid_email_class,
            error_email_text = this.props.state.current_value.valid_email_text,
            error_password_class = this.props.state.save_block.error_password_class,
            save_btn_class = this.props.state.save_block.save_btn_class,
            save_btn_text = this.props.state.save_block.save_btn_text;
        return (
            <div className={"personal__wrap" + pa_visible + pre_pa_visible} onMouseDown={this.closePersonalArea}>
                <div className="p-area__cont">
                
                    <div className="close__btn">&#x2716;</div>

                    <p className="p-area__title">Личный кабинет</p>  

                    <div className="change__block cont"
                        onInput={this.changeInputBlock}>
                        <label className="login__cont">
                            <p className="title">Логин: </p>
                            <input type="text" className="login__input input__field" placeholder="Введите новый логин"
                                value={this.props.state.current_value.login}
                            />
                        </label>
                        <label className="email__cont">
                            <p className="title">E-mail: </p>                        
                            <input type="text" className="email__input input__field" placeholder="Введите новый E-mail"
                                value={this.props.state.current_value.email}
                                onBlur={this.backToPrevEmail}
                                />
                            <div className={"error_wrong-email" + error_email_class}>{error_email_text}</div>
                        </label>

                        <div className="pass__cont">
                            <label className="password__cont pass__input-cont">
                                <p className="title">Введите новый пароль: 
                                    <span className={"notice" + valid_password_class}>{valid_password_text}</span>
                                </p>
                                <input type="password" className="password__input input__field" placeholder="Придумайте пароль"/>
                                <label className="hide__pass">
                                    <input type="checkbox" className="hidden" onChange = {CC.changeCheckboxPass}/>
                                    <span className="helper"></span>
                                </label>
                            </label>
                            <label className="password-repeat__cont pass__input-cont" >
                                <p className="title">Повторите новый пароль: </p>
                                <input type="password" className="password__input input__field" placeholder="Повторите пароль"/>
                                <label className="hide__pass">
                                    <input type="checkbox" className="hidden" onChange = {CC.changeCheckboxPass}/>
                                    <span className="helper"></span>
                                </label>
                            </label>
                        </div>     
                    </div>
                    <div className={"save__block" + save_disable_class}>
                        <label className="password__cont">
                            <p className="title">Введите старый пароль: </p>
                            <input type="password" className={"password__input input__field" + error_password_class} readOnly={save_disable}
                                onInput={this.changeSaveBlockPass}
                                value={this.props.state.save_block.old_password}
                            />
                        </label>
                        <div className={"save__btn default__btn" + save_disable_class + save_btn_class}
                            onClick={this.saveAccountChange}>
                            {save_btn_text}
                        </div>
                    </div>
                </div>
                <div className="loader"></div>
            </div>
        )
    }
}