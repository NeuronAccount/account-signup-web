import { Button, TextField } from 'material-ui';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatchable } from '../_common/action';
import TimedText, { TextTimestamp } from '../_common/TimedText';
import { smsCodeParams, smsSignupParams } from '../api/account-private/gen';
import { apiSmsCode, apiSmsSignup, RootState } from '../redux';

interface Props {
    errorMessage: TextTimestamp;
    smsCodeSentMessage: TextTimestamp;

    apiSmsCode: (p: smsCodeParams) => Dispatchable;
    apiSmsSignup: (p: smsSignupParams) => Dispatchable;
}

interface State {
    errorMessage: TextTimestamp;
    signupPhone: string;
    signupSmsCode: string;
    signupPassword: string;
}
const initialState = {
    errorMessage: {text: '', timestamp: new Date()},
    signupPhone: '',
    signupSmsCode: '',
    signupPassword: ''
};

class SignupPage extends React.Component<Props, State> {
    private static renderTitle() {
        return (
            <div
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
        );
    }

    public componentWillMount() {
        this.onPhoneChanged = this.onPhoneChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.onSmsCodeChanged = this.onSmsCodeChanged.bind(this);
        this.onSendSmsCodeButtonClick = this.onSendSmsCodeButtonClick.bind(this);
        this.onSignupButtonClick = this.onSignupButtonClick.bind(this);

        this.setState(initialState);
    }

    public componentWillReceiveProps(nextProps: Props) {
        const errorMessage = nextProps.errorMessage;
        const {text, timestamp} = errorMessage;
        if (text !== this.props.errorMessage.text
            || timestamp !== this.props.errorMessage.timestamp) {
            this.setState({errorMessage});
        }
    }

    public render() {
        return (
            <div>
                {SignupPage.renderTitle()}
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        return (
            <div
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '300px',
                    marginTop: '48px',
                }}
            >
                <div style={{height: '10px'}}>
                    {this.renderErrorMessage()}
                </div>
                {this.renderSmsSignup()}
            </div>
        );
    }

    private renderErrorMessage() {
        const {errorMessage} = this.state;
        if (!errorMessage) {
            return null;
        }

        const {text, timestamp} = errorMessage;

        return (
            <TimedText
                text={text}
                timestamp={timestamp}
                intervalMillSec={3000}
                style={{fontSize: '50%', color: 'red'}}
            />
        );
    }

    private onError(message: string) {
        this.setState({errorMessage: {text: message, timestamp: new Date()}});
    }

    private renderSmsSignup() {
        return (
            <div>
                {this.renderPhone()}
                {this.renderPassword()}
                {this.renderSmsCodeContainer()}
                {this.renderSignupButton()}
            </div>
        );
    }

    private renderPhone() {
        return (
            <TextField
                margin="normal"
                fullWidth={true}
                label={'手机号'}
                value={this.state.signupPhone}
                onChange={this.onPhoneChanged}
            />
        );
    }

    private onPhoneChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({signupPhone: e.target.value});
    }

    private renderSmsCodeContainer() {
        return (
            <div>
                {this.renderSmsCode()}
                <div style={{height: '20px'}}>
                    {this.renderSmsCodeSentMessage()}
                </div>
                {this.renderSendSmsCodeButton()}
            </div>
        );
    }

    private renderSmsCode() {
        return (
            <TextField
                margin="normal"
                style={{width: '100px', float: 'left'}}
                label={'验证码'}
                value={this.state.signupSmsCode}
                onChange={this.onSmsCodeChanged}
            />
        );
    }

    private onSmsCodeChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({signupSmsCode: e.target.value});
    }

    private renderSmsCodeSentMessage() {
        const {smsCodeSentMessage} = this.props;
        if (!smsCodeSentMessage) {
            return null;
        }

        const {text, timestamp} = smsCodeSentMessage;

        return (
            <TimedText
                text={text}
                timestamp={timestamp}
                intervalMillSec={3000}
                style={{fontSize: 'x-small', color: '#BBB', float: 'right'}}
            />
        );
    }

    private renderSendSmsCodeButton() {
        return (
            <Button
                style={{float: 'right', marginTop: '10px', backgroundColor: '#86ce2f', color: '#FFF'}}
                onClick={this.onSendSmsCodeButtonClick}
            >
                发送短信验证码
            </Button>
        );
    }

    private onSendSmsCodeButtonClick() {
        const {signupPhone} = this.state;
        if (signupPhone === '') {
            return this.onError('！请输入手机号');
        }

        this.props.apiSmsCode({scene: 'SMS_SIGNUP', phone: signupPhone});
    }

    private renderPassword() {
        return (
            <TextField
                margin="normal"
                fullWidth={true}
                type={'password'}
                label={'登录密码'}
                value={this.state.signupPassword}
                onChange={this.onPasswordChanged}
            />
        );
    }

    private onPasswordChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({signupPassword: e.target.value});
    }

    private renderSignupButton() {
        return (
            <Button
                style={{backgroundColor: '#86ce2f', color: '#FFF', width: '100%', marginTop: '20px'}}
                onClick={this.onSignupButtonClick}
            >
                <label style={{fontSize: 'large'}}>注 册</label>
            </Button>
        );
    }

    private onSignupButtonClick() {
        const {signupPhone, signupPassword, signupSmsCode} = this.state;

        if (signupPhone === '') {
            return this.onError('！请输入手机号');
        }

        if (signupPassword === '') {
            return this.onError('！请输入密码');
        }

        if (signupSmsCode === '') {
            return this.onError('！请输入验证码');
        }

        this.props.apiSmsSignup({
            phone: signupPhone,
            smsCode: signupSmsCode,
            password: signupPassword
        });
    }
}

function selectProps(state: RootState) {
    return {
        errorMessage: state.errorMessage,
        smsCodeSentMessage: state.smsCodeSentMessage,
    };
}

export default connect(
    selectProps, {
    apiSmsCode,
    apiSmsSignup})(SignupPage);