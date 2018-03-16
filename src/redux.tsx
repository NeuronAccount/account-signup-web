import { combineReducers } from 'redux';
import { Dispatchable, StandardAction } from './_common/action';
import { TextTimestamp } from './_common/TimedText';
import {
    DefaultApiFactory,  smsCodeParams, smsSignupParams
} from './api/account-private/gen';
import { HOST } from './ENV';

const accountApi = DefaultApiFactory(undefined, fetch, HOST + '/api-private/v1/accounts');

const SMS_CODE_FAILURE = 'SMS_CODE_FAILURE';
const SMS_CODE_SUCCESS = 'SMS_CODE_SUCCESS';
const SMS_SIGNUP_FAILURE = 'SMS_SIGNUP_FAILURE';

export interface RootState {
    errorMessage: TextTimestamp;
    smsCodeSentMessage: TextTimestamp;
}

export const apiSmsCode = (p: smsCodeParams): Dispatchable => (dispatch) => {
    return accountApi.smsCode(p.scene, p.phone, p.captchaId, p.captchaCode)
        .then(() => {
            dispatch({type: SMS_CODE_SUCCESS});
        })
        .catch((err) => {
            dispatch({type: SMS_CODE_FAILURE, error: true, payload: err});
        });
};

export const apiSmsSignup = (p: smsSignupParams): Dispatchable => (dispatch) => {
    return accountApi.smsSignup(p.phone, p.smsCode, p.password)
        .then(() => {
            alert('注册成功，请前往登录');
            window.close();
        })
        .catch((err) => {
            dispatch({type: SMS_SIGNUP_FAILURE, error: true, payload: err});
        });
};

const initErrorMessage = {text: '', timestamp: new Date()};
const errorMessage = (state: TextTimestamp= initErrorMessage, action: StandardAction): TextTimestamp => {
    switch (action.type) {
        case SMS_CODE_FAILURE:
        case SMS_SIGNUP_FAILURE:
            return {text: action.payload.message, timestamp: new Date()};
        default:
            return state;
    }
};

const smsCodeSentMessage = (state: TextTimestamp = initErrorMessage, action: StandardAction): TextTimestamp => {
    switch (action.type) {
        case SMS_CODE_SUCCESS:
            return {text: '验证码已发送', timestamp: new Date()};
        default:
            return state;
    }
};

export const rootReducer = combineReducers<RootState>({
    errorMessage,
    smsCodeSentMessage,
});