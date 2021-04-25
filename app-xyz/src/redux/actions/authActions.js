export const sendEnterFormStart = () => {
    return {type: 'SEND_ENTER_FORM_START'};
};

export const sendEnterFormEnd = (resp, history, stage) => {
    return {
        type: 'SEND_ENTER_FORM_END',
        resp: resp,
        history: history,
        stage: stage
    };
};

export const authChangeLogin = (resp) => {
    return {
        type: 'AUTH_CHANGE_LOGIN',
        resp: resp
    };
};

export const authChangeQuit = () => {
    return {
        type: 'AUTH_CHANGE_QUIT'
    };
};

export const personalAreaSetStartValue = (resp) => {
    return {
        type: 'PA_SET_START_VALUE',
        resp: resp
    };
};