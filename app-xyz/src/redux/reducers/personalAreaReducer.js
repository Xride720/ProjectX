import CommonClass from '../../WorkClass/CommonClass';
const CC = new CommonClass();
// PA - Personal Area
const PA_SET_START_VALUE = 'PA_SET_START_VALUE';
const OPEN_PA = 'OPEN_PA';
const CLOSE_PA = 'CLOSE_PA';
const CHANGE_BLOCK_INPUT = 'CHANGE_BLOCK_INPUT';
const CHANGE_SAVE_BLOCK = 'CHANGE_SAVE_BLOCK';
const BACK_TO_PREV_EMAIL = 'BACK_TO_PREV_EMAIL';
const CHANGE_USER_DATA_SUCCESS = 'CHANGE_USER_DATA_SUCCESS';
const CHANGE_USER_DATA_ERROR = 'CHANGE_USER_DATA_ERROR';
const CHANGE_USER_DATA_ERROR_EMAIL = 'CHANGE_USER_DATA_ERROR_EMAIL';
const CHANGE_USER_DATA_ERROR_PASSWORD = 'CHANGE_USER_DATA_ERROR_PASSWORD';


let  initialState = {
    pre_visible: false,
    visible: false,
    prev_value : {
        login: '',
        email: '',
    },
    current_value: {
        login: '',
        email: '',
        valid_email: true,
        valid_email_class: '',
        valid_email_text: 'Неверный E-mail',
        password: '',
        repeat_password: '',
        valid_password: false,
        valid_password_class: '',
        valid_password_text: '' 
    },
    save_block: {
        disable: true,
        old_password: '',
        error_password_class: '', 
        save_btn_text: 'Сохранить изменения',
        save_btn_class: ''
    }
};

const personalAreaReducer = (state = initialState, action) => {
    switch (action.type) {
        case PA_SET_START_VALUE:
            if (!action.resp.success) return state;
            let resp = action.resp.data;
            return Object.assign({}, state, {
                prev_value : {
                    login: resp.login,
                    email: resp.email,
                },
                current_value: {
                    login: resp.login,
                    email: resp.email,
                    valid_email: true,
                    valid_email_class: '',
                    valid_email_text: 'Неверный E-mail',
                    password: '',
                    repeat_password: '',
                    valid_password: false,
                    valid_password_class: '',
                    valid_password_text: '' 
                }
            });
        case OPEN_PA:
            if (action.stage == 1)
                state.pre_visible = true;
            else if (action.stage == 2)
                state.visible = true;
                console.log(state);
            return state;
        case CLOSE_PA:
            state.visible = false;
            return state;
        case CHANGE_BLOCK_INPUT:
            state.current_value[action.field] = action.data;
            let current =  {
                login : state.current_value.login,
                email : state.current_value.email,
                password : state.current_value.password,
                repeat_password : state.current_value.repeat_password,
                valid_password : state.current_value.valid_password
            },
            prev = {
                login : state.prev_value.login,
                email : state.prev_value.email
            };
            if (action.field == 'password') {
                let check = CC.checkPassValid(current.password);
                state.current_value.valid_password_class = check.notice_class;
                state.current_value.valid_password_text = check.notice_text;
                state.current_value.valid_password = check.valid_pass;
            }

            if (action.field == 'email') {
                state.current_value.valid_email_class = CC.validateEmail(current.email) ? '' : ' active ';
            }

            if (((current.login !== prev.login && current.login != '')
                || (current.email !== prev.email && current.email != ''))
                && ((current.password === current.repeat_password && current.valid_password) 
                || (current.password == '' && current.repeat_password == '')))
                state.save_block.disable = false;
            else state.save_block.disable = true;
            
            return state;
        case CHANGE_SAVE_BLOCK:
            state.save_block[action.field] = action.data;
            state.save_block.error_password_class = '';
            return state;
        case BACK_TO_PREV_EMAIL:
            state.current_value.email = state.prev_value.email;
            state.current_value.valid_email = true;
            return state;
        case CHANGE_USER_DATA_SUCCESS:
            if (action.stage == 1) {
                state.prev_value.login = state.current_value.login;
                state.prev_value.email = state.current_value.email;
                state.current_value.password = '';
                state.current_value.repeat_password = '';
                state.current_value.valid_password_class = '';
                state.current_value.valid_password_text = '';
                state.current_value.valid_password = false;
                state.save_block.save_btn_class = ' success ';
                state.save_block.save_btn_text = 'Сохранено';
            } else if (action.stage == 2) {
                state.save_block.old_password = '';
                state.save_block.disable = true;
                state.save_block.save_btn_class = '';
                state.save_block.save_btn_text = 'Сохранить изменения';
            }
            return state;
        case CHANGE_USER_DATA_ERROR:
            if (action.stage == 1) {
                state.save_block.save_btn_class = ' error ';
                state.save_block.save_btn_text = 'Не удалось обновить данные';
            } else if (action.stage == 2) {
                state.save_block.save_btn_class = '';
                state.save_block.save_btn_text = 'Сохранить изменения';
            }
            return state;
        case CHANGE_USER_DATA_ERROR_EMAIL:
            if (action.stage == 1) {
                state.current_value.valid_email = false;
                state.current_value.valid_email_class = ' active ';
                state.current_value.valid_email_text = 'Данный E-mail занят';
            } else if (action.stage == 2) {
                state.current_value.valid_email_class = '';
            } else if (action.stage == 3) {
                state.current_value.valid_email = true;
                state.current_value.email = state.prev_value.email;
                state.current_value.valid_email_text = 'Неверный E-mail';
            }
            return state;
        case CHANGE_USER_DATA_ERROR_PASSWORD:
            state.save_block.error_password_class = ' error ';
            return state;
        default:
            return state;
    }

};

export default personalAreaReducer;