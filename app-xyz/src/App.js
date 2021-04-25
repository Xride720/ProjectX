import './App.css';
import AppBar from './Components/AppBar/AppBar';
import EnterForm from './Components/EnterForm/EnterForm'; 
import PersonalArea from './Components/PersonalArea/PersonalArea';
import {BrowserRouter, Route} from 'react-router-dom';


function App(props) {
  let main_blur= props.state.enter_form.visible 
    || props.state.personal_area.visible ? 'blur' : '';
  return (
    <BrowserRouter>
      <div className="App">      
        <Route path='/entry' 
          render={ (history) => <EnterForm history={history} 
                                dispatch={props.dispatch} 
                                state={props.state.enter_form}/>} />

        <PersonalArea dispatch={props.dispatch}
                      state={props.state.personal_area}/>

        <div className={"wrapper " + main_blur}>
          <AppBar dispatch={props.dispatch}
                  state={props.state.app_bar}/>        
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
