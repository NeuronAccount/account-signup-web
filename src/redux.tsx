import { combineReducers } from 'redux';
import {
    DefaultApiFactory, smsCode_FAILURE, smsCode_SUCCESS, SmsCodeParams, smsSignup_FAILURE,
    SmsSignupParams
} from './api/account-private/gen/api';
import { isUndefined } from 'util';
import { Dispatch } from 'react-redux';
import { StandardAction, Dispatchable } from './_common/action';
import { TextTimestamp } from './_common/TimedText';

let accountApi = DefaultApiFactory(fetch, 'http://127.0.0.1:8083/api-private/v1/accounts' );

export interface RootState {
    errorMessage: TextTimestamp;
    smsCodeSentMessage: TextTimestamp;
}

export function apiSmsCode(params: SmsCodeParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return accountApi.smsCode(params)
            .then(() => {
                dispatch({type: smsCode_SUCCESS});
            })
            .catch((err) => {
                dispatch({type: smsCode_FAILURE, error: true, payload: err});
            });
    };
}

export function apiSmsSignup(params: SmsSignupParams): Dispatchable {
    return function (dispatch: Dispatch<StandardAction>) {
        return accountApi.smsSignup(params)
            .then(() => {
                alert('注册成功，请前往登录');
                window.close();
            })
            .catch((err) => {
                dispatch({type: smsSignup_FAILURE, error: true, payload: err});
            });
    };
}

function errorMessage(state: TextTimestamp, action: StandardAction): TextTimestamp {
    if (isUndefined(state)) {
        return {text: '', timestamp: new Date()};
    }

    switch (action.type) {
        case smsCode_FAILURE:
        case smsSignup_FAILURE:
            return {text: action.payload.message, timestamp: new Date()};
        default:
            return state;
    }
}

function smsCodeSentMessage(state: TextTimestamp, action: StandardAction): TextTimestamp {
    if (isUndefined(state)) {
        return {text: '', timestamp: new Date()};
    }

    switch (action.type) {
        case smsCode_SUCCESS:
            return {text: '验证码已发送', timestamp: new Date()};
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    errorMessage,
    smsCodeSentMessage,
});