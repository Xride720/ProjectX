import {combineReducers, createStore} from 'redux';
import appBarReducer from './reducers/appBarReducer';
import enterFormReducer from './reducers/enterFormReducer';
import personalAreaReducer from './reducers/personalAreaReducer';

let reducers = combineReducers({
    enter_form: enterFormReducer,
    app_bar: appBarReducer,
    personal_area: personalAreaReducer
});

let store = createStore(reducers);


export default store;