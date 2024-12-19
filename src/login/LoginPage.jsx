import React, { Component } from "react";
import SubodhaLogo from "../images/Subodha Logo_1.png";
import VELogo from "../images/VE logo.png";
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import Cookies from 'js-cookie';
import axios from 'axios';

  class Login extends Component {
    constructor(props) {
      super(props);
      this.state = {
        darkLanguages: [],
        languages: [],
        email :'',
        password:'',
        forgotEmail:'',
        loginPage:true,
      };
    }

  componentDidMount(){
    document.getElementById("auth_page_title").innerText = "Welcome to Subodha : Login Page| Subodha"
    var darkLang = []
    var current_lang = Cookies.get('lang', { domain: process.env.SITE_DOMAIN, path: '/', secure: false, sameSite: "Lax" })
    let selectTag = document.getElementById("langOptions");
    selectTag.addEventListener('click', this.handleLangOptionsClick); 
    const lang_dict = []
    Localize.getAvailableLanguages((error, data) => {
      data.map((e, i) => {
        var lang_name = e.name;
        if (e.code == "hi-IN" || e.code == "hi") {
          lang_name = e.name + "(Hindi)";
        } else if (e.code == "kn") {
          lang_name = e.name + "(Kannada)";
        } else if (e.code == "bn") {
          lang_name = e.name + "(Bangali)"
        }
        else if (e.code == "en") {
          lang_name = e.name + "(English)"
        } else if (e.code == "ta-IN") {
          lang_name = e.name + "(Tamil (India))"
        } else if (e.code == "or") {
          lang_name = e.name + "(Odia)"
        } else if (e.code == "ml-IN" || e.code == "ml") {
          lang_name = e.name + "(Malayalam)"
        }
        lang_dict.push({ "name": e.name, "code": e.code })
      })
    });
    axios.get(`${getConfig().LMS_BASE_URL}` + '/mx-user-info/get_user_profile').then((res) => {
      for (let i = 0; i < res.data.dark_languages.length; i++) {
        var code = res.data.dark_languages[i][0]
        var name = res.data.dark_languages[i][1]
        if (code != 'en') {
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

          darkLang.push(code)
          lang_dict.push({ "name": name, "code": code })
        }
      }
      this.setState({ languages: lang_dict })
      this.state.languages.map((lang, i) => {
        var option = new Option(lang.name, lang.code)
        selectTag.append(option)
      })
      const options = selectTag.options
      for (let i = 0; i < options.length; i++) {
        if (current_lang == options[i].value) {
          options[i].setAttribute("selected", true)
        }
        else{
          options[i].removeAttribute("selected", true)
        }
      }
    })
    this.setState({ darkLanguages: darkLang })
    $('#langOptions > option').each(function () {
      if (current_lang == $(this).val()) {
        $(this).attr('selected', true);
      } else {
        $(this).removeAttr("selected");
      }
    })
  }
  requestConfig = {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    isPublic: true,
  };

  SubmitLoginForm = () => {
    getAuthenticatedHttpClient()
      .post(
        `${getConfig().LMS_BASE_URL}/api/user/v2/account/login_session/`,
        {
          "email_or_username": "",
          "email": this.state.email,
          "password": this.state.password
        },
        this.requestConfig,
      ).then((res) => {
        if (res.status == 200 && res.data.success == true) {
          window.location = res.data.redirect_url
          Cookies.set('email', this.state.email, { domain: process.env.SITE_DOMAIN, path: '/', secure: false, sameSite: "Lax" })   
        }
        
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          const responseData = error.response.data;
          if (responseData.success === false && responseData.value) {
            // alert(`Login Failed: ${responseData.value}`);
            document.getElementById("login_error_box").style.display="block";
            document.getElementById("error_msg").innerHTML = responseData.value;
          } else {
            alert("Login Failed: Invalid request. Please check your input.");
          }
        } else {
          // Handle other types of errors
          console.error("An unexpected error occurred:", error);
          alert("An unexpected error occurred. Please try again later.");
        }
      });

  }

  ForgotPasswordForm = () => {
    getAuthenticatedHttpClient()
      .post(
        `${getConfig().LMS_BASE_URL}/account/password`,
        {
          "email": this.state.forgotEmail,
        },
        this.requestConfig,
      ).then((res) => {
        if(res.status == 200){
          this.setState({loginPage:true});

          document.getElementById("forgot_password_success").style.display="block";
        }
      })
      .catch((e) => {
        console.log(e.customAttributes.httpErrorResponseData)
      })
  }

  handleLangOptionsClick = (e) => {
    var setLang = e.target.value
    localStorage.setItem("langButtonClicked", true);
    localStorage.setItem("lang", e.target.value)
    Cookies.remove('lang', { domain: process.env.SITE_DOMAIN, path: '/', secure: false, sameSite: "Lax" })   
    Cookies.set('lang', setLang, { domain: process.env.SITE_DOMAIN, path: '/', secure: false, sameSite: "Lax" })   
    Localize.setLanguage(setLang);
    $('#langOptions > option').each(function () {
      if (setLang == $(this).val()) {
        $(this).attr('selected', true);
      } else {
        $(this).removeAttr("selected");
      }
    })

    setTimeout(() => {
      Localize.untranslate($(".myLang").get(0));
    }, 100);

  }

  render(){return (
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
            {this.state.loginPage ? <section id="login-anchor" className="form-type">
              <div id="login-form" className="form-wrapper">
                <div className="js-form-feedback" aria-live="assertive" tabIndex={-1}>
                  <div class="js-password-reset-success status submission-success" id="forgot_password_success" style={{display:"none"}}>
                    <h4 class="message-title">Check Your Email</h4>
                    <div class="message-copy">
                      <p>You entered <b>{this.forgotEmail}</b>. If this email address is associated with your Subodha account, we will send a message with password recovery instructions to this email address.</p><p>If you do not receive a password reset message after 1 minute, verify that you entered the correct email address, or check your spam folder.</p><p>If you need further assistance, <a href="">contact technical support</a>.</p>
                    </div>
                  </div>

                  <div className="js-form-feedback" id="login_error_box" aria-live="assertive" tabindex="-1" style={{display:"none"}}>
                    <div className="js-form-errors status submission-error">
                    <h4 className="message-title">We could not sign you in.</h4>
                    <ul className="message-copy">
                        <li id="error_msg"></li>
                    </ul>
                    </div>
                  </div>

                </div>
                <h2>Sign In</h2>
                <form id="login" className="login-form" tabIndex={-1} onSubmit={(e) => { e.preventDefault(); this.SubmitLoginForm() }}>
                  <div className="form-field">
                    <label for="login-email" aria-hidden="true">
                      <span className="label-text">Enter your Email ID below</span>
                    </label>
                    <input id="login-email" defaultValue={this.state.email} onChange={(e) => { this.setState({email:e.target.value}) }} type="email" name="email" className="input-block " minlength="3" maxlength="254" aria-label="Sign in Enter Your Email ID below" aria-hidden="false" focusable="true" tabIndex={0} />
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
                    <input id="login-password" defaultValue={this.state.password} onChange={(e) => { this.setState({password:e.target.value}) }} type="password" name="password" className="input-block " maxlength="5000" required="" aria-invalid={false} aria-label="Enter Your Password below" aria-hidden={false} focusable={true} tabIndex={0} />
                    <span id="login-password-validation-error" className="tip error" aria-live="assertive">
                      <span className="sr-only"></span>
                      <span id="login-password-validation-error-msg"></span>
                    </span>
                    <button type="button" className="forgot-password field-link" onClick={(e)=>{this.setState({loginPage:false})}}>Forgot Password?</button>
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
                  <form id="password-reset" className="password-reset-form" tabIndex={-1} onSubmit={(e) => { e.preventDefault(); this.ForgotPasswordForm() }}>
                    <p className="action-label">Please enter your log-in or recovery email address below and we will send you an email with instructions.</p>
                    <label for="password-reset-email" aria-hidden="true">
                      <span className="label-text" style={{ color: "black" }}>Enter your Email ID below </span>
                    </label>
                    <input id="password-reset-email" defaultValue={this.state.forgotEmail} onChange={(e) => { this.setState({forgotEmail:e.target.value}) }} type="email" name="email" className="input-block " aria-describedby="password-reset-email-desc password-reset-email-validation-error" minlength="3" maxlength="254" placeholder="username@domain.com" aria-label="Enter Your Email ID below" aria-hidden="false" focusable="true" tabIndex={0} />
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
  )}
}

export default Login;