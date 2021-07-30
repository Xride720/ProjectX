const AUTH_CHANGE_LOGIN = 'AUTH_CHANGE_LOGIN';
const AUTH_CHANGE_QUIT = 'AUTH_CHANGE_QUIT';
const CHANGE_AUTH = 'CHANGE_AUTH';

let  initialState = {
    is_auth: false,
    login: '',
    email: '',
    user_id: '',
    role: ''
};

const appBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_CHANGE_LOGIN:
            let result = {}, resp = action.resp;
            if (resp.success) {
                result = {
                    is_auth: true,
                    login: resp.data.login,
                    email: resp.data.email,
                    user_id: resp.data.id,
                    role: resp.data.role
                };
                document.cookie = "id=" + resp.data.id;
            }
            return Object.assign({}, state, result);
        case AUTH_CHANGE_QUIT:            
            document.cookie = "id=";
            return Object.assign({}, state, {
                is_auth: false,
                login: '',
                email: '',
                user_id: '',
                role: ''
            });
        case CHANGE_AUTH:
            state.is_auth = true;
            state.login = action.data.login;
            state.email = action.data.email;
            state.role = action.data.role;
            state.user_id = action.data.user_id;
            return state;
        default:
            return state;
    }

};

export default appBarReducer;