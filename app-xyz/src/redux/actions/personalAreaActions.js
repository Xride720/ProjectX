export const changeBlockInput = (data, field) => {
    return {
        type: 'CHANGE_BLOCK_INPUT',
        field: field,
        data: data
    };
};

export const changeSaveBlock = (data, field) => {
    return {
        type: 'CHANGE_SAVE_BLOCK',
        field: field,
        data: data
    };
};

export const backToPrevEmail = () => {
    return {
        type: 'BACK_TO_PREV_EMAIL'
    };
};

export const changeUserDataSuccess = (stage) => {
    return {
        type: 'CHANGE_USER_DATA_SUCCESS',
        stage: stage
    };
};

export const changeUserDataErrorEmail = (data, stage) => {
    return {
        type: 'CHANGE_USER_DATA_ERROR_EMAIL',
        data: data,
        stage: stage
    };
};
export const changeUserDataErrorPassword = () => {
    return {
        type: 'CHANGE_USER_DATA_ERROR_PASSWORD'
    };
};
export const changeUserDataError = (data, stage) => {
    return {
        type: 'CHANGE_USER_DATA_ERROR',
        data: data,
        stage: stage
    };
};