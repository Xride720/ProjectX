import React, { Component } from 'react';
import ForgotPass from './ForgotPass/ForgotPass';
import RegistrationFrom from './RegistrationForm/RegistrationFrom';
import './enterFromStyle.css';
import { Link, Route } from 'react-router-dom';
import Entry from './Entry/Entry';
import CommonClass from '../../WorkClass/CommonClass';
const CC = new CommonClass();

export default class EnterForm extends Component {
    constructor(props) {
        super(props);
        console.log(props.history);

        this.closeEntry = this.closeEntry.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this.props.dispatch({type: 'OPEN_ENTER_FORM'});          
    }

    closeEntry(e) {
        if (!e.target.closest('.enter__form')) 
            this.props.dispatch({type: 'CLOSE_ENTER_FORM', history: this.props.history.history}); 
    }

    render() {
        return (
            <div className="enter__wrap" onClick={this.closeEntry}>
                <form className="enter__form">
                    <Route exact path="/entry" 
                        render={ () => <Entry  mainClass='enter__form-container' 
                                            dispatch={this.props.dispatch}
                                            state={this.props.state}
                                            history={this.props.history.history}
                                            />} />
                    <Route exact path="/entry/forgot_pass" render={ () => <ForgotPass mainClass='enter__form-container'/>} />
                    <Route exact path="/entry/registration" render={ () => <RegistrationFrom mainClass='enter__form-container'/>} />                    
                </form>
            </div>
        )
    }
}