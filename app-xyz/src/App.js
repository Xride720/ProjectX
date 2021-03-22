import './App.css';
import AppBar from './Components/AppBar/AppBar';
import EnterForm from './Components/EnterForm/EnterForm'; 
import PersonalArea from './Components/PersonalArea/PersonalArea';


function App() {
  return (
    <div className="App">      
      <div className="enter__wrap"><EnterForm /></div>
      <div className="personal__wrap">
        <PersonalArea />
        <div className="loader"></div>
      </div>
      <div className="wrapper">
        <AppBar />        
      </div>
    </div>
  );
}

export default App;
