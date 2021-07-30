import React, { Component } from 'react';
import './App.css';
import AppBar from './Components/AppBar/AppBar';
import EnterForm from './Components/EnterForm/EnterForm';
import PersonalArea from './Components/PersonalArea/PersonalArea';
import { BrowserRouter, Route } from 'react-router-dom';
import CommonClass from './WorkClass/CommonClass';
const CC = new CommonClass();

export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  async componentDidMount() {
  // Check auth
    let id = '';
    document.cookie.split(';').forEach(item => {
        let el = item.split('=');
        if (el[0] === 'id') {
            id = el[1];
            return;
        }
    });
    if (id == '') return {success: false};
    const resp = await CC.request('/api/check_auth', 'POST', {id: id});
    if (resp.success) {
      this.props.dispatch({
        type: 'CHANGE_AUTH',
        data: resp.data
      });
      this.props.dispatch({
        type: 'PA_SET_START_VALUE',
        resp: resp.data
      });
    }
  }
  render() {
    let main_blur = this.props.state.enter_form.visible
      || this.props.state.personal_area.visible ? 'blur' : '';
    return (
      <BrowserRouter>
        <div className="App">
          <Route path='/entry'
            render={(history) => <EnterForm history={history}
              dispatch={this.props.dispatch}
              state={this.props.state.enter_form} />} />

          <PersonalArea dispatch={this.props.dispatch}
            state={this.props.state.personal_area} />

          <div className={"wrapper " + main_blur}>
            <AppBar dispatch={this.props.dispatch}
              state={this.props.state.app_bar} />
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

