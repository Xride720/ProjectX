import React, { Component } from 'react';
import './ForgotPassStyle.css';
import CommonClass from '../../../WorkClass/CommonClass';
const CC = new CommonClass();

export default class ForgotPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClickSend = this.handleClickSend.bind(this);
    }

    handleChange(event) {
        this.setState({email : event.target.value});
        // document.querySelector('.error_wrong-email').classList.remove('active');
    }

    async handleClickSend(event) {
        let email_el = document.querySelector('.recovery-pass [type="email"].input__field');
        if (CC.validateElEmail(email_el)) {
            CC.errorEl(event.target);
            return; 
        } 
        
        console.log(email_el.value);
        const resp = await CC.request('/api/recovery_pass', 'POST', {email: email_el.value});
        console.log(resp);
        this.handleResponse(resp, event.target);
    }

    handleResponse(resp, el) {
        if (resp.success) {
            console.log('mail sent');
            document.querySelector('.recovery-pass__email.cont').style.display = 'none';
            document.querySelector('.recovery-pass .mail__sent').style.display = 'block';
            
            setTimeout(() => {
                CC.backToEnter();
                document.querySelector('.recovery-pass__email.cont').style.display = 'flex';
                document.querySelector('.recovery-pass .mail__sent').style.display = 'none';
            }, 2000);
        } else {
            let er_el = el.closest('.cont').querySelector('.error_wrong-email');
            er_el.textContent = 'Аккаунт с таким E-mail не существует';
            er_el.classList.add('active');
            let promise = new Promise (resolve => { 
                setTimeout(() => {
                    er_el.classList.remove('active');
                    resolve();              
                }, 2000);
            });
            promise.then(result => {
                setTimeout(() => {
                    er_el.textContent = 'Неверный E-mail'; 
                }, 500);                 
            });
        }
    }

    render() {
        return (
            <div className="recovery-pass">
                <div className="back__btn"
                    onClick = {CC.backToEnter}>
                    Назад
                </div>
                <div className="recovery-pass__email cont">
                    <p>На ваш E-mail будет отправлено письмо с дальнейшими инструкциями для восстановления пароля</p>
                    <label>Введите ваш E-mail:</label>
                    <input type="email"  value = {this.state.email} className="input__field"
                        onChange = {this.handleChange}
                    />  
                    <div className="error_wrong-email">Неверный E-mail</div>
                    <div className="send__email"
                        onClick = {this.handleClickSend}>
                        Отправить письмо
                    </div>
                </div>
                <p className="mail__sent"> На указанный e-mail отправлено письмо с интрукциями по восстановлению пароля.</p>
            </div>
        )
    }
}