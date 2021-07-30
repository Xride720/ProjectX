import CommonClass from './../../WorkClass/CommonClass';
import store from '../store';

const CC = new CommonClass();


const OPEN_ENTER_FORM = 'OPEN_ENTER_FORM';
const CLOSE_ENTER_FORM = 'CLOSE_ENTER_FORM';
const CHANGE_ENTER_FORM_EMAIL = 'CHANGE_ENTER_FORM_EMAIL';
const CHANGE_ENTER_FORM_PASS = 'CHANGE_ENTER_FORM_PASS';
const SEND_ENTER_FORM_START = 'SEND_ENTER_FORM_START';
const SEND_ENTER_FORM_END = 'SEND_ENTER_FORM_END';

let  initialState = {
    visible: false,
    email: '',
    password: '',
    loader: false,
    success_auth: false,
    error_auth: false,
};

const enterFormReducer = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_ENTER_FORM:
            state.visible = true;
            return state;
        case CLOSE_ENTER_FORM:
            state.visible = false;
            state.login = '';
            state.password = '';
            action.history.replace('/');
            return state;
        case CHANGE_ENTER_FORM_EMAIL:
            state.email = action.newData;
            return state;
        case CHANGE_ENTER_FORM_PASS:
            state.password = action.newData;
            return state;
        case SEND_ENTER_FORM_START:
            state.loader = true;
            return state;
        case SEND_ENTER_FORM_END:
            state.loader = false;
            let resp = action.resp;
            if (resp.success) {
                if (action.stage == 1) {
                    state.success_auth = true;
                }
                else if (action.stage == 2) {
                    action.history.replace('/');
                    state.visible = false;
                    state.success_auth = false;
                    state.password = '';
                    state.email = '';
                }
            } else {
                if (action.stage == 1)
                    state.error_auth = true;
                else if (action.stage == 2)
                    state.error_auth = false;
            }
            return state;
        default:
            return state;
    }
};

export default enterFormReducer;

