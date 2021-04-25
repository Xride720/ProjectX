const AUTH_CHANGE_LOGIN = 'AUTH_CHANGE_LOGIN';
const AUTH_CHANGE_QUIT = 'AUTH_CHANGE_QUIT';

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
            }
            return Object.assign({}, state, result);
        case AUTH_CHANGE_QUIT:            
            
            return Object.assign({}, state, {
                is_auth: false,
                login: '',
                email: '',
                user_id: '',
                role: ''
            });
        default:
            return state;
    }

};

export default appBarReducer;