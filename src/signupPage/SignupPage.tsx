import * as React from 'react';
import { TextField } from 'material-ui';
import { AnyAction } from 'redux';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { ApiError, apiSmsCode, apiSmsSignup, RootState, SmsCodeParams, SmsSignupParams } from '../redux';

interface Props {
    apiSmsCode: (params: SmsCodeParams,
                 onSuccess: () => void,
                 onError: (err: ApiError) => void) => (dispatch: (action: AnyAction) => void) => void;
    apiSmsSignup: (params: SmsSignupParams,
                   onSuccess: (jwt: string) => void,
                   onError: (err: ApiError) => void) => (dispatch: (action: AnyAction) => void) => void;
}

interface State {
    queryParams: Map<string, string>;
    inputError: string;
    inputErrorTimer: number;
    inputErrorNotifyStartTime: Date;
    signupPhone: string;
    signupSmsCode: string;
    signupPassword: string;
}

class SignupPage extends React.Component<Props, State> {
    componentWillMount() {
        let queryParamsMap = new Map<string, string>();
        if (window.location.search.startsWith('?')) {
            window.location.search.substring(1).split('&').forEach((pair) => {
                const tokens = pair.split('=');
                if (tokens.length > 1) {
                    queryParamsMap.set(tokens[0], tokens[1]);
                } else {
                    queryParamsMap.set(tokens[0], '');
                }
            });
        }

        this.setState({
            queryParams: queryParamsMap,
            inputError: '',
            signupPhone: '',
            signupSmsCode: '',
            signupPassword: ''
        });

        this.onLoginSuccess = this.onLoginSuccess.bind(this);
        this.onApiError = this.onApiError.bind(this);
    }

    onLoginInputError(message: string) {
        if (this.state.inputErrorTimer != null) {
            clearInterval(this.state.inputErrorTimer);
        }

        this.setState({inputError: message, inputErrorNotifyStartTime: new Date()});

        if (message == null || message === '') {
            return;
        }

        let t: number = window.setInterval(() => {
            if (new Date().getTime() - this.state.inputErrorNotifyStartTime.getTime() > 3000) {
                this.setState({inputError: ''});
                clearInterval(t);
            }
        },                                 200);

        this.setState({inputErrorTimer: t});
    }

    onLoginSuccess(jwt: string) {
        console.log('onLoginSuccess', jwt);
    }

    onApiError(err: ApiError) {
        this.onLoginInputError(err.message);
    }

    renderSmsSignup() {
        return (
            <div>
                <TextField
                    margin="normal"
                    fullWidth={true}
                    label={'手机号'}
                    value={this.state.signupPhone}
                    onChange={(e) => {
                        this.setState({signupPhone: e.target.value});
                    }}
                />
                <TextField
                    margin="normal"
                    fullWidth={true}
                    type={'password'}
                    label={'密码'}
                    value={this.state.signupPassword}
                    onChange={(e) => {
                        this.setState({signupPassword: e.target.value});
                    }}
                />
                <div>
                    <TextField
                        margin="normal"
                        style={{width: '100px', float: 'left'}}
                        label={'验证码'}
                        value={this.state.signupSmsCode}
                        onChange={(e) => {
                            this.setState({signupSmsCode: e.target.value});
                        }}
                    />
                    <Button
                        style={{float: 'right', marginTop: '30px', backgroundColor: '#86ce2f', color: '#FFF'}}
                        onClick={() => {
                            if (this.state.signupPhone == null || this.state.signupPhone === '') {
                                return this.onLoginInputError('！请输入手机号');
                            }

                            this.props.apiSmsCode({scene: 'SMS_SIGNUP', phone: this.state.signupPhone},
                                                  () => {
                                    console.log('success');
                                },
                                                  (err) => {
                                    this.onLoginInputError(err.message);
                                });
                        }}
                    >
                        发送短信验证码
                    </Button>
                </div>
                <Button
                    style={{backgroundColor: '#86ce2f', color: '#FFF', width: '100%', marginTop: '20px'}}
                    onClick={() => {
                        if (this.state.signupPhone == null || this.state.signupPhone === '') {
                            return this.onLoginInputError('！请输入手机号');
                        }

                        if (this.state.signupPassword == null || this.state.signupPassword === '') {
                            return this.onLoginInputError('！请输入密码');
                        }

                        if (this.state.signupSmsCode == null || this.state.signupSmsCode === '') {
                            return this.onLoginInputError('！请输入验证码');
                        }

                        this.props.apiSmsSignup({
                                phone: this.state.signupPhone,
                                smsCode: this.state.signupSmsCode,
                                password: this.state.signupPassword
                            },
                                                this.onLoginSuccess,
                                                this.onApiError);
                    }}
                >
                    <label style={{fontSize: 'large'}}>注 册</label>
                </Button>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div
                    id={'header'}
                    style={{
                        width: '100%',
                        height: '48px',
                        backgroundColor: '#444'
                    }}
                >
                    <label
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            color: '#FFF',
                            fontSize: '200%'
                        }}
                    >
                        注册火星帐号
                    </label>
                </div>
                <div
                    style={{
                        width: '300px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '100px',
                    }}
                >

                    <div style={{marginTop: '40px'}}>
                        <div style={{marginTop: '5px', height: '10px'}}>
                            <label style={{fontSize: '50%', color: 'red'}}>{this.state.inputError}</label>
                        </div>
                        {this.renderSmsSignup()}
                    </div>
                </div>
            </div>
        );
    }
}

function selectProps(state: RootState) {
    return {};
}

export default connect(
    selectProps, {
    apiSmsCode,
    apiSmsSignup})( SignupPage);