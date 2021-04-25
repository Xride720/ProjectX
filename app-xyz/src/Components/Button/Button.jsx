import React from 'react';
import s from './Button.module.css';
import { NavLink } from 'react-router-dom';

let Button = (props) => {
    let hidden = props.hidden ? ' hidden ' : '',
        err = props.err ? props.err : '';
    function stopPaste(e) {
        e.preventDefault();
    }

    if (props.type == 'login__btn') {
        return (
            <NavLink to='/entry' className={s[props.type] + ' default__btn ' + hidden} onMouseMove={stopPaste}>{props.text}</NavLink>
        );
    }
    return (
        <div className={s[props.type] + ' default__btn ' + hidden + err} 
            onClick={props.handler}
            onMouseMove={stopPaste}>
            {props.text}
        </div>
    )

}

export default Button;