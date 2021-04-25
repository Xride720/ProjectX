import React, { Component } from 'react';
import './RegistrationFromStyle.css';
import CommonClass from '../../../WorkClass/CommonClass';
import Button from '../../Button/Button';
import { NavLink } from 'react-router-dom';
const CC = new CommonClass();

export default class RegistrationFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.reg_pass = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*.-]{8,}/g;

        this.handleClickRegistration = this.handleClickRegistration.bind(this);

    }    

    async handleClickRegistration(event) {
        let flag_error = false;
        let login = document.querySelector('.registration__form-cont .name__input').value,
            email = document.querySelector('.registration__form-cont .email__input').value,
            email_el = document.querySelector('.registration__form-cont .email__input'),
            role = document.querySelector('.registration__form-cont .role__client-input').checked  ? 'client' : 'staff',
            pass = document.querySelector('.registration__form-cont .registration__pass').value,
            pass_repeat = document.querySelector('.registration__form-cont .registration__pass-repeat').value,
            pass_el = document.querySelector('.registration__form-cont .registration__pass'),
            pass_repeat_el = document.querySelector('.registration__form-cont .registration__pass-repeat');
    // Проверка имени
        if (login == '') {
            flag_error = true;
            CC.errorEl(document.querySelector('.registration__form-cont .name__input'));
        }
    // Проверка email       
        if (CC.validateElEmail(email_el)) {
            CC.errorEl(event.target);
            CC.errorEl(email_el);
            flag_error = true; 
        }    
    // Проверка пароля   
        if (CC.validatePass(pass_el, pass_repeat_el)) flag_error = true;

        if (flag_error) return;

        let bodyReq = {
            login : login,
            email: email, 
            role: role,
            password: pass
        };
        const data = await CC.request('/api/registration', 'POST', bodyReq);
        console.log(data);
        if (data.success) {
            console.log('Registration success');
            document.querySelector('.registration__form.cont').style.display = 'none';
            document.querySelector('.registration__form-cont .registration-success').style.display = 'block';
            
            setTimeout(() => {
                // CC.backToEnter();
                document.querySelector('.registration__form.cont').style.display = 'flex';
                document.querySelector('.registration__form-cont .registration-success').style.display = 'none';
            }, 2000);
        } else {
            console.log('This email is busy');
            let er_el = email_el.closest('.cont').querySelector('.error_wrong-email');
            er_el.textContent = 'Данный E-mail занят';
            er_el.classList.add('active');
            let promise = new Promise (resolve => { 
                setTimeout(() => {
                    er_el.classList.remove('active');
                    resolve();              
                }, 1000);
            });
            promise.then(result => {
                setTimeout(() => {
                    er_el.textContent = 'Неверный E-mail'; 
                }, 500);                 
            });
            
        }
    }

    stopPaste(event) {
        if (event.code === 'KeyV' && event.ctrlKey) {
            event.preventDefault();
            return;
        }
    }

    render() {
        return (
            <div className="registration__form-cont">                
                <div className="registration__form cont">
                    <NavLink to="/entry" className="back__btn">Назад</NavLink>

                    <div className="registration__name">
                        <p className="title">Имя</p>
                        <input type="text" className="name__input input__field"/>
                    </div>
                    <div className="registration__email">
                        <p className="title">E-mail</p>
                        <input type="text" className="email__input input__field"/>
                    </div>
                    <div className="error_wrong-email">Неверный E-mail</div>
                    <div className="registration__select-role">
                        <label  className="role__client-cont">
                            Клиент
                            <input type="radio" className="role__client-input" name="role" defaultChecked/>
                        </label>
                        <label  className="role__staff-cont">
                            Мастер
                            <input type="radio" className="role__staff-input" name="role"/>
                        </label>
                    </div>
                    <div className="registration__pass-cont pass__cont">
                        <p className="pass__title title">Придумайте пароль <span className="notice"></span></p>
                        <div className="pass__input-cont">
                            <input type="password" className="registration__pass input__field"
                                    onInput = {CC.checkPassValid}
                                    onKeyDown = {this.stopPaste}
                                    />
                            <label className="hide__pass">
                                <input type="checkbox" className="hidden" 
                                    onChange = {CC.changeCheckboxPass}
                                    onKeyDown = {this.stopPaste}
                                    />
                                <span className="helper"></span>
                            </label>
                        </div>

                        <p className="pass__title-repeat title">Повторите пароль</p>
                        <div className="pass__input-cont">
                            <input type="password" className="registration__pass-repeat input__field"/>
                            <label className="hide__pass">
                                <input type="checkbox" className="hidden" onChange = {CC.changeCheckboxPass}/>
                                <span className="helper"></span>
                            </label>
                        </div>
                    </div>
                    <Button text="Зарегистрироваться" type="registration__btn" handler={this.handleClickRegistration}/>
                </div> 
                <p className="registration-success">Регистрация прошла успешно! <br/> На указанный e-mail отправлено письмо с интрукциями для активации аккаунта.</p>
            </div>
        )
    }
}