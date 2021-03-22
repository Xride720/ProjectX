import React, { Component } from 'react';
import AppBarNav from './AppBarNav/AppBarNav';
import './AppBarStyle.css';
import CommonClass from '../../WorkClass/CommonClass';
const CC = new CommonClass();

export default class AppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {


        };
    }

    

    openEnterForm(e) {
        e.stopPropagation();
        let under = e.target.closest('.App').querySelector('.enter__wrap');
        
        CC.show(under);
        CC.blurOn(e.target.closest('.App .wrapper'));        
    }

    logout() {
        let auth_block = document.querySelector('.auth__block'),
            login_btn = auth_block.querySelector('.login__btn'),
            auth_info = auth_block.querySelector('.auth__block-info'),
            p_area_btn = auth_block.querySelector('.p-area__btn');
        auth_info.classList.add('hidden');
        p_area_btn.classList.add('hidden');
        CC.show(login_btn);
        auth_block.dataset.value = '';
        auth_info.querySelector('.name').textContent = '';
    } 

    openPersonalArea(e) {
        CC.blurOn(e.target.closest('.App .wrapper')); 
        e.target.closest('.App').querySelector('.personal__wrap').style.display = 'flex';
        setTimeout(() => {e.target.closest('.App').querySelector('.personal__wrap').classList.add('visible')});
        
    }

    render() {
        return (
            <div className="appbar__cont">
                <AppBarNav />
                <div className="auth__block" data-value="">
                    <div className="p-area__btn default__btn hidden" onClick={this.openPersonalArea}>Личный кабинет</div>
                    <div className="login__btn default__btn" onClick={this.openEnterForm}>Войти</div>
                    <div className="auth__block-info hidden">
                        <p className="auth__name">Вы вошли как: <span className="name"></span></p>
                        <div className="logout__btn default__btn"
                            onClick={this.logout}>
                            Выход
                        </div>
                    </div>                     
                </div>
                
            </div>
        )
    }
}