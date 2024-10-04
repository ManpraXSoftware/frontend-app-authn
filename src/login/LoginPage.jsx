import React, { useState } from "react";
import SubodhaLogo from "../images/Subodha Logo_1.png";
import VELogo from "../images/VE logo.png";
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { useEffect } from "react";

const Login = () => {
  document.getElementById("auth_page_title").innerText = "Welcome to Subodha : Login Page| Subodha"
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [loginPage, setLoginPage] = useState(true);

  const requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  useEffect(()=>{
    // getUserInfo()
  }, [])
  const SubmitLoginForm = () => {
    getAuthenticatedHttpClient()
      .post(
        `${getConfig().LMS_BASE_URL}/api/user/v2/account/login_session/`,
        {
          "email_or_username": "",
          "email": email,
          "password": password
        },
        requestConfig,
      ).then((res) => {
        if (res.status == 200 && res.data.success == true) {
          window.location = res.data.redirect_url
        }
      })
  }

  const ForgotPasswordForm = () => {
    getAuthenticatedHttpClient()
      .post(
        `${getConfig().LMS_BASE_URL}/account/password`,
        {
          "email": forgotEmail,
        },
        requestConfig,
      ).then((res) => {
        if(res.status == 200){
          setLoginPage(true);
          document.getElementById("forgot_password_success").style.display="block";
        }
      })
      .catch((e) => {
        console.log(e.customAttributes.httpErrorResponseData)
      })
  }

  const getUserInfo = () => {
    getAuthenticatedHttpClient().get(process.env.LMS_BASE_URL + '/mx-user-info/get_user_profile')
        .then((res) => {
            if (res.status == 200) {                
                let selectTag = document.getElementById("langOptions");
                for (let i = 0; i < res.data.dark_languages.length; i++) {
                    var code = res.data.dark_languages[i][0]
                    var name = res.data.dark_languages[i][1]
                    if(code != 'en'){
                        if (code == "hi-IN" || code == "hi") {
                            name = name + "(Hindi)";
                        } else if (code == "kn") {
                            name = name + "(Kannada)";
                        } else if (code == "bn") {
                            name = name + "(Bangali)"
                        } else if (code == "en") {
                            name = name + "(English)"
                        } else if (code == "ta-IN") {
                            name = name + "(Tamil (India))"
                        } else if (code == "or") {
                            name = name + "(Odia)"
                        } else if (code == "ml-IN" || code == "ml") {
                            name = name + "(Malayalam)"
                        }
                        var option = new Option(name, code)
                        selectTag.append(option)
                    }
                }
            }
        })
        .catch((err)=>{
          console.log("err",err)
        })
}

  return (
    <div className="section-bkg-wrapper">
      <p id="lms-url" url-data={process.env.LMS_BASE_URL} hidden></p>
      <main id="main" tabIndex={-1} className="login-register-content">
        <div className="login-upper-logo">
          <p>
            <span tabIndex={0}>
              <img src={SubodhaLogo} alt='Subodha Learning For All' />
            </span>
            <span className="login-upper-text" tabIndex={0}>
              Subodha is a learning management system containing accessible resources for students with visual impairments and their educators.
            </span>
          </p>
        </div>
        <div id="content-container">
          <div id="login-and-registration-container" className="login-register">
            {loginPage ? <section id="login-anchor" className="form-type">
              <div id="login-form" className="form-wrapper">
                <div className="js-form-feedback" aria-live="assertive" tabIndex={-1}>
                  <div class="js-password-reset-success status submission-success" id="forgot_password_success" style={{display:"none"}}>
                    <h4 class="message-title">Check Your Email</h4>
                    <div class="message-copy">
                      <p>You entered <b>{forgotEmail}</b>. If this email address is associated with your Subodha account, we will send a message with password recovery instructions to this email address.</p><p>If you do not receive a password reset message after 1 minute, verify that you entered the correct email address, or check your spam folder.</p><p>If you need further assistance, <a href="">contact technical support</a>.</p>
                    </div>
                  </div>
                </div>
                <h2>Sign In</h2>
                <form id="login" className="login-form" tabIndex={-1} onSubmit={(e) => { e.preventDefault(); SubmitLoginForm() }}>
                  <div className="form-field">
                    <label for="login-email" aria-hidden="true">
                      <span className="label-text">Enter your Email ID below</span>
                    </label>
                    <input id="login-email" defaultValue={email} onChange={(e) => { setEmail(e.target.value) }} type="email" name="email" className="input-block " minlength="3" maxlength="254" aria-label="Sign in Enter Your Email ID below" aria-hidden="false" focusable="true" tabIndex={0} />
                    <span id="login-email-validation-error" className="tip error" aria-live="assertive">
                      <span className="sr-only"></span>
                      <span id="login-email-validation-error-msg"></span>
                    </span>
                    <span className="tip tip-input" id="login-email-desc"></span>
                  </div>
                  <div className="form-field password-password">
                    <label for="login-password" aria-hidden="true">
                      <span className="label-text">Enter your Password below </span>
                      <span id="login-password-required-label" className="label-required hidden">
                      </span>
                      <span className="icon fa" id="login-password-validation-icon" aria-hidden="true"></span>
                    </label>
                    <input id="login-password" defaultValue={password} onChange={(e) => { setPassword(e.target.value) }} type="password" name="password" className="input-block " maxlength="5000" required="" aria-invalid={false} aria-label="Enter Your Password below" aria-hidden={false} focusable={true} tabIndex={0} />
                    <span id="login-password-validation-error" className="tip error" aria-live="assertive">
                      <span className="sr-only"></span>
                      <span id="login-password-validation-error-msg"></span>
                    </span>
                    <button type="button" className="forgot-password field-link" onClick={(e)=>{setLoginPage(false)}}>Forgot Password?</button>
                  </div>
                  <button type="submit" className="action action-primary action-update js-login login-button">Sign in</button>
                  <div className="register-info-message">To create a new account please write to<a href="mailto:subodhavisionempowertrust@gmail.com
">subodhavisionempowertrust@gmail.com
                  </a></div>
                </form>
              </div>
            </section> :
              <><section id="login-anchor" className="form-type"></section>
                <section id="password-reset-anchor" className="form-type">
                  <div className="js-form-feedback" aria-live="assertive" tabIndex={-1}>
                  </div>
                  <h1 className="section-title">Password assistance</h1>
                  <form id="password-reset" className="password-reset-form" tabIndex={-1} onSubmit={(e) => { e.preventDefault(); ForgotPasswordForm() }}>
                    <p className="action-label">Please enter your log-in or recovery email address below and we will send you an email with instructions.</p>
                    <label for="password-reset-email" aria-hidden="true">
                      <span className="label-text" style={{ color: "black" }}>Enter your Email ID below </span>
                    </label>
                    <input id="password-reset-email" defaultValue={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value) }} type="email" name="email" className="input-block " aria-describedby="password-reset-email-desc password-reset-email-validation-error" minlength="3" maxlength="254" placeholder="username@domain.com" aria-label="Enter Your Email ID below" aria-hidden="false" focusable="true" tabIndex={0} />
                    <button type="submit" className="action action-primary action-update js-reset">Recover my password</button>
                  </form>
                </section></>}
          </div>
        </div >
        <div className="login-bottom-logo">
          <div className="for-align">
            <div className="for-text">
              <span>powered by</span>
              <a className="subodha-logo">
                <img src={VELogo} alt='Vision Empower' /></a>
              <a className="edx-logo">
                <img src="https://files.edx.org/openedx-logos/open-edx-logo-tag.png" width="175" height="70" alt="Powered by Open edX" />
              </a>
            </div>
          </div>
        </div>
      </main >
    </div >
  )
}

export default Login;