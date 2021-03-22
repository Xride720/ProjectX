import React, { Component } from 'react';
import './PersonalAreaStyle.css';
import CommonClass from '../../WorkClass/CommonClass';
const CC = new CommonClass();

export default class PersonalArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            email: '',
            new_pass: '',
            data: ''
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.changeInputBlock = this.changeInputBlock.bind(this);
        this.saveAccountChange = this.saveAccountChange.bind(this);
    }
    componentDidMount() {
        
        document.querySelector('.personal__wrap').addEventListener('mousedown', function(e) {
            if (!e.target.closest('.p-area__cont') || e.target.closest('.p-area__cont .close__btn')) {
                // CC.hide(document.querySelector('.enter__wrap'));
                CC.blurOff(document.querySelector('.App .wrapper'));
                this.classList.remove('visible');
                this.style.display = 'none';
            }
        });

        let $this = this;
        
        document.querySelector('.personal__wrap .change__data').addEventListener('change', function(e) {
            let data = e.target.value;
            console.log(data);
            if (data != '') {
                data = JSON.parse(data);
                $this.setState({
                    login: data.login,
                    email: data.email,
                    data: JSON.stringify(data)
                });
            }
        });

    }

    changeInputBlock(e) {
        if (e.target.matches('input[type="text"], input[type="password"]')) {
            let prev_val = e.target.closest('.change__block').querySelector('.change__data').dataset.prevValue,
                cont = document.querySelector('.personal__wrap .change__block');    

            let data = {
                login: cont.querySelector('.login__input').value.trim(),
                email: cont.querySelector('.email__input').value.trim(),
                new_pass: cont.querySelector('.password__input').value
            };
            if (prev_val) prev_val = JSON.parse(prev_val);
            this.setState({
                login: data.login,
                email: data.email,
                data: JSON.stringify(data)
            });
            let pass_el = cont.querySelector('.password__cont input'),
                pass_repeat_el = cont.querySelector('.password-repeat__cont input');
            let pass_flag = cont.querySelector('.notice').textContent == 'Надёжный пароль' && pass_el.value == pass_repeat_el.value;
            
            if (data.login != prev_val.login || data.email != prev_val.email || pass_flag) {
                document.querySelector('.personal__wrap .save__block').classList.remove('disable');
                document.querySelector('.personal__wrap .save__block [type="password"]').readOnly = false;
            } else {
                document.querySelector('.personal__wrap .save__block').classList.add('disable');
                document.querySelector('.personal__wrap .save__block [type="password"]').readOnly = true;
            }
        }
    }

    async saveAccountChange(e) {  
        if (e.target.closest('.save__block').matches('.disable')) return;   
        let pass_el = document.querySelector('.personal__wrap .change__block .password__cont input'),
            pass_repeat_el = document.querySelector('.personal__wrap .password-repeat__cont input'),
            email_el = document.querySelector('.personal__wrap .email__input'),
            data_el = document.querySelector('.personal__wrap .change__data'),
            old_email = data_el.dataset.prevValue,
            error_flag = false;

        if (old_email) old_email = JSON.parse(data_el.dataset.prevValue).email;

    // Проверка email       
        if (CC.validateElEmail(email_el)) {
            CC.errorEl(e.target);
            CC.errorEl(email_el);
            error_flag = true; 
        } 
    // Проверка пароля
        if ( pass_el.value != '' ) {
            if (CC.validatePass(pass_el,pass_repeat_el)) {error_flag = true};
        }

        if (error_flag) return;


        let req_body = JSON.parse(this.state.data),
        old_pass_el = document.querySelector('.personal__wrap .save__block .password__cont input');
        req_body.old_email = old_email;
        req_body.pass = old_pass_el.value;
        old_pass_el.value = '';
        console.log(req_body);
        const resp = await CC.request('/api/change_user', 'POST', req_body);
        if (resp.success) {
            pass_el.value = '';
            pass_repeat_el.value = '';
            document.querySelector('.personal__wrap .change__block .notice').textContent = '';

            let btn = e.target;
            btn.innerHTML = 'Сохранено &#x2714;';
            btn.classList.add('success');

            setTimeout(() => {
                btn.textContent = 'Сохранить изменения';
                btn.classList.remove('success');                
            }, 1500);
        } else {
            console.log(resp.error);
            if (resp.error_type == 1) {
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
            } else if (resp.error_type == 3) {
                CC.errorEl(old_pass_el);
            }
        }
    }

    render() {
        return (
            <div className="p-area__cont">
            
                <div className="close__btn">&#x2716;</div>

                <p className="p-area__title">Личный кабинет</p>  

                <div className="change__block cont"
                    onInput={this.changeInputBlock}>
                    <label className="login__cont">
                        <p className="title">Логин: </p>
                        <input type="text" className="login__input input__field" placeholder="Введите новый логин"
                            defaultValue={this.state.login}
                        />
                    </label>
                    <label className="email__cont">
                        <p className="title">E-mail: </p>                        
                        <input type="text" className="email__input input__field" placeholder="Введите новый E-mail"
                            defaultValue={this.state.email}/>
                        <div className="error_wrong-email">Неверный E-mail</div>
                    </label>

                    <div className="pass__cont">
                        <label className="password__cont pass__input-cont">
                            <p className="title">Введите новый пароль: <span className="notice"></span></p>
                            <input type="password" className="password__input input__field" placeholder="Придумайте пароль"
                                onInput = {CC.checkPassValid}
                            />
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

                    <input type="hidden" className="change__data" data-prev-value=""
                            defaultValue={this.state.data}/>
                </div>
                <div className="save__block disable">
                    <label className="password__cont">
                        <p className="title">Введите старый пароль: </p>
                        <input type="password" className="password__input input__field" readOnly/>
                    </label>
                    <div className="save__btn default__btn disable"
                        onClick={this.saveAccountChange}>
                        Сохранить изменения
                    </div>
                </div>
            </div>
        )
    }
}