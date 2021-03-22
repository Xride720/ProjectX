import React, { Component } from 'react';
import ForgotPass from './ForgotPass/ForgotPass';
import RegistrationFrom from './RegistrationForm/RegistrationFrom';
import './enterFromStyle.css';
import CommonClass from '../../WorkClass/CommonClass';
const CC = new CommonClass();

export default class EnterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        let form = this;
        document.querySelector('.enter__wrap').addEventListener('mousedown', function(e) {
            if (!e.target.closest('.enter__form')) {
                CC.hide(document.querySelector('.enter__wrap'));
                CC.blurOff(document.querySelector('.App .wrapper'));
                CC.cleanEnterForm();
                CC.backToEnter();
                form.setState({
                    email : '',
                    password : ''                    
                });
            }
        });
        document.querySelector('.auth__block .login__btn').addEventListener('mousemove', function(e) {
            e.preventDefault();
        });
    }

    handleChange(event) {
        this.setState({[event.target.dataset.id] : event.target.value});
    }

    async handleClick(event) {
        console.log(this.state);
        
        const resp = await CC.request('/api/auth', 'POST', this.state);
        console.log(resp);
        if (resp.success) {
            document.querySelector('.enter__form-container').style.display = "none";
            document.querySelector('.enter__form .success__auth').style.display = "block";
            let cut_data = {
                login: resp.data.login,
                email: resp.data.email,
                id: resp.data.id
            };
            setTimeout(() => {
                let enter_wrap = document.querySelector('.enter__wrap'),
                    auth_block = document.querySelector('.auth__block');
                document.querySelector('.auth__block .name').textContent = resp.data.login;
                document.querySelector('.auth__block').dataset.value = JSON.stringify(cut_data);
                document.querySelector('.personal__wrap .change__data').value = JSON.stringify(cut_data);
                document.querySelector('.personal__wrap .change__data').dataset.prevValue = JSON.stringify(cut_data);
                document.querySelector('.personal__wrap .change__data').dispatchEvent(new InputEvent('change'));
                CC.hide(auth_block.querySelector('.login__btn'));
                CC.hide(enter_wrap);
                auth_block.querySelector('.auth__block-info').classList.remove('hidden');
                CC.blurOff(document.querySelector('.App .wrapper'));
                document.querySelector('.enter__form-container').style.display = "flex";
                document.querySelector('.enter__form .success__auth').style.display = "none";
                CC.cleanEnterForm();
                this.setState({
                    email : '',
                    password : ''
                });
                auth_block.querySelector('.p-area__btn').classList.remove('hidden');
            }, 1500);
        } else {
            document.querySelector('.enter__form .error__auth').style.opacity = "1";
            CC.errorEl(document.querySelector('.enter__form-container .enter__email input'));
            CC.errorEl(document.querySelector('.enter__form-container .enter__password input'));
            CC.errorEl(document.querySelector('.enter__form-container .enter__btn'));
            setTimeout(() => {
                document.querySelector('.enter__form .error__auth').style.opacity = "0";
            }, 1000);
        }
    }

    showNextForm(event) {
        document.querySelector('.' + event.target.dataset.nextClass).style.display = 'block';
        document.querySelector('.enter__form-container').style.display = "none";
    }

    sendEnter(e) {
        
        if (e.key == 'Enter') {
            console.log(e.key);
            document.querySelector('.enter__form-container .enter__btn').click();
        }
    }

    render() {
        return (
                <form className="enter__form">
                    <div className="success__auth">Вы вошли!</div>
                    <div className="enter__form-container"
                        onKeyDown={this.sendEnter}>
                        <div className="error__auth">Неверный E-mail или пароль</div>                        
                        <div className="enter__email">
                            <label>E-mail:</label>
                            <input type="text" data-id="email" className="input__field"
                                value={this.state.email}
                                onChange = {this.handleChange}
                            />
                        </div>
                        <div className="enter__password">
                            <label>Пароль:</label>
                            <input type="password" data-id="password" name="password" className="input__field"
                                value={this.state.password}
                                onChange = {this.handleChange}
                            />
                        </div>
                        <div className="enter__btn default__btn"
                        onClick = {this.handleClick}>
                            Войти
                        </div>
                        <div className = "enter__other">
                            <div className = "other__registration"
                                onClick = {this.showNextForm} 
                                data-next-class = "registration__form-cont">Регистрация</div>
                            <div className = "other__forgot-pass"
                                onClick = {this.showNextForm}
                                data-next-class = "recovery-pass">Забыли пароль?</div>
                        </div>
                    </div>  
                    <ForgotPass mainClass='enter__form-container'/>
                    <RegistrationFrom mainClass='enter__form-container'/>
                </form>
        )
    }
}