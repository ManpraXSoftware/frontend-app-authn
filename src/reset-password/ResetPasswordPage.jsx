import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Spinner } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

import SubodhaLogo from '../images/Subodha Logo_1.png';
import VELogo from '../images/VE logo.png';

import { resetPassword, validateToken } from './data/actions';
import {
  FORM_SUBMISSION_ERROR, PASSWORD_RESET, PASSWORD_RESET_ERROR, PASSWORD_VALIDATION_ERROR, TOKEN_STATE,
} from './data/constants';
import { resetPasswordResultSelector } from './data/selectors';
import { validatePassword } from './data/service';
import { getAllPossibleQueryParams } from '../data/utils';
import { getConfig } from '@edx/frontend-platform';

const ERROR_MESSAGES = {
  [FORM_SUBMISSION_ERROR]: 'Please check your responses and try again.',
  [PASSWORD_RESET.FORBIDDEN_REQUEST]: 'An error occurred because of too many requests. Please try again after some time.',
  [PASSWORD_RESET.INTERNAL_SERVER_ERROR]: 'An error has occurred. Try refreshing the page, or check your internet connection.',
};

const PageShell = ({ children }) => (
  <div className="section-bkg-wrapper">
    <main id="main" tabIndex={-1} className="login-register-content">
      <div className="login-upper-logo">
        <p>
          <span tabIndex={0}>
            <img src={SubodhaLogo} alt="Subodha logo with tag line Learning for all" />
          </span>
          <span className="login-upper-text" tabIndex={0}>
            Subodha is a learning management system containing accessible resources for students with visual impairments and their educators.
          </span>
        </p>
      </div>
      <div id="content-container">
        <div id="login-and-registration-container" className="login-register">
          <section id="login-anchor" className="form-type">
            <div id="login-form" className="form-wrapper">
              {children}
            </div>
          </section>
        </div>
      </div>
      <div className="login-bottom-logo">
        <div className="for-align">
          <div className="for-text">
            <span>powered by</span>
            <a className="subodha-logo">
              <img src={VELogo} alt="Vision Empower" />
            </a>
            <a className="edx-logo">
              <img src="https://files.edx.org/openedx-logos/open-edx-logo-tag.png" width="175" height="70" alt="Powered by Open edX" />
            </a>
          </div>
        </div>
      </div>
    </main>
  </div>
);

PageShell.propTypes = {
  children: PropTypes.node.isRequired,
};

const InvalidLinkMessage = ({ errorCode }) => {
  const isRateLimit = errorCode === PASSWORD_RESET.FORBIDDEN_REQUEST;
  const isServerError = errorCode === PASSWORD_RESET.INTERNAL_SERVER_ERROR;

  if (isRateLimit || isServerError) {
    return (
      <div className="js-form-feedback" aria-live="assertive" tabIndex={-1}>
        <div className="js-form-errors status submission-error">
          <h4 className="message-title">An error occurred.</h4>
          <ul className="message-copy">
            <li>{ERROR_MESSAGES[errorCode]}</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="js-form-feedback" aria-live="assertive" tabIndex={-1}>
      <div className="status submission-error">
        <h4 className="message-title">Invalid Password Reset Link</h4>
        <ul className="message-copy" style={{ color: 'white' }}>
          <li>
            This password reset link is invalid. It may have been used already.
          </li>
          <li>
            To reset your password, go to the{' '}
            <a href={`${getConfig().LMS_BASE_URL}/login`} style={{ color: 'white' }}>sign-in</a> page and select{' '}
            <strong>Forgot password</strong>.
          </li>
        </ul>
      </div>
    </div>
  );
};

InvalidLinkMessage.defaultProps = {
  errorCode: null,
};

InvalidLinkMessage.propTypes = {
  errorCode: PropTypes.string,
};

const ResetPasswordPage = (props) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errorCode, setErrorCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    if (
      props.status !== TOKEN_STATE.PENDING
      && props.status !== PASSWORD_RESET_ERROR
      && props.status !== TOKEN_STATE.VALID
      && props.status !== 'pending'
    ) {
      setErrorCode(props.status);
    }
    if (props.status === PASSWORD_VALIDATION_ERROR) {
      setFormErrors(prev => ({ ...prev, newPassword: props.errorMsg || 'Password criteria has not been met' }));
      setErrorMsg(props.errorMsg || '');
    }
    if (props.status === 'success') {
      setCountdown(5);
    }
  }, [props.status, props.errorMsg]);

  useEffect(() => {
    const mx_localizekey = Array.isArray(getConfig().MX_LOCALIZEKEY)
      ? getConfig().MX_LOCALIZEKEY[0]
      : getConfig().MX_LOCALIZEKEY;
    if (!mx_localizekey) { return; }

    const siteDomain = Array.isArray(getConfig().SITE_DOMAIN)
      ? getConfig().SITE_DOMAIN[0]
      : getConfig().SITE_DOMAIN;

    let current_lang = Cookies.get('lang', { domain: siteDomain, path: '/', secure: false, sameSite: 'Lax' });
    if (!current_lang) { current_lang = 'en'; }

    Localize.initialize({ key: mx_localizekey, rememberLanguage: true, retranslateOnNewPhrases: true });

    const selectTag = document.getElementById('langOptions');
    if (!selectTag) { return; }

    const langNameMap = (code, name) => {
      if (code === 'hi-IN' || code === 'hi') { return `${name}(Hindi)`; }
      if (code === 'kn') { return `${name}(Kannada)`; }
      if (code === 'bn') { return `${name}(Bangali)`; }
      if (code === 'en') { return `${name}(English)`; }
      if (code === 'ta-IN') { return 'தமிழ்(Tamil)'; }
      if (code === 'or') { return `${name}(Odia)`; }
      if (code === 'ml-IN' || code === 'ml') { return `${name}(Malayalam)`; }
      return name;
    };

    Localize.getAvailableLanguages((error, data) => {
      if (error || !data) { return; }
      // Clear existing options before appending
      while (selectTag.options.length > 0) { selectTag.remove(0); }
      data.forEach((e) => {
        const option = new Option(langNameMap(e.code, e.name), e.code);
        if (e.code === current_lang) { option.selected = true; }
        selectTag.append(option);
      });
    });

    const handleLangChange = (e) => {
      const setLang = e.target.value;
      Cookies.remove('lang', { domain: siteDomain, path: '/', secure: false, sameSite: 'Lax' });
      Cookies.set('lang', setLang, { domain: siteDomain, path: '/', secure: false, sameSite: 'Lax' });
      Localize.setLanguage(setLang);
      setTimeout(() => { Localize.untranslate(selectTag); }, 100);
    };

    selectTag.addEventListener('change', handleLangChange);
    // eslint-disable-next-line consistent-return
    return () => selectTag.removeEventListener('change', handleLangChange);
  }, []);

  useEffect(() => {
    if (countdown === null) { return undefined; }
    if (countdown === 0) {
      window.location.href = `${getConfig().LMS_BASE_URL}/login`;
      return undefined;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const validatePasswordFromBackend = async (password) => {
    let errorMessage = '';
    try {
      errorMessage = await validatePassword({ reset_password_page: true, password });
    } catch (err) {
      errorMessage = '';
    }
    setFormErrors(prev => ({ ...prev, newPassword: errorMessage }));
  };

  const validateInput = (name, value) => {
    const errors = { ...formErrors };
    switch (name) {
      case 'newPassword':
        if (!value || value.length < 4) {
          errors.newPassword = 'Password must be at least 4 characters';
        } else if (value.length > 75) {
          errors.newPassword = 'Password must be 75 characters or fewer';
        } else {
          validatePasswordFromBackend(value);
          errors.newPassword = '';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          errors.confirmPassword = 'Confirm your password';
        } else if (value !== newPassword) {
          errors.confirmPassword = 'Passwords do not match';
        } else {
          errors.confirmPassword = '';
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
    return !Object.values(errors).some(x => x !== '');
  };

  const handleOnBlur = (e) => validateInput(e.target.name, e.target.value);

  const handleOnFocus = (e) => setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const isPasswordValid = validateInput('newPassword', newPassword);
    const isPasswordConfirmed = validateInput('confirmPassword', confirmPassword);

    if (isPasswordValid && isPasswordConfirmed) {
      props.resetPassword(
        { new_password1: newPassword, new_password2: confirmPassword },
        props.token,
        getAllPossibleQueryParams(),
      );
    } else {
      setErrorCode(FORM_SUBMISSION_ERROR);
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  // Validating token
  if (props.status === TOKEN_STATE.PENDING) {
    if (token) {
      props.validateToken(token);
      return <Spinner animation="border" variant="primary" className="spinner--position-centered" />;
    }
    return (
      <PageShell>
        <InvalidLinkMessage errorCode={PASSWORD_RESET.INVALID_TOKEN} />
      </PageShell>
    );
  }

  // Token was invalid / expired
  if (props.status === PASSWORD_RESET_ERROR) {
    return (
      <PageShell>
        <InvalidLinkMessage errorCode={props.errorCode} />
      </PageShell>
    );
  }

  // Show success message then redirect
  if (props.status === 'success') {
    return (
      <PageShell>
        <div className="js-form-feedback" aria-live="assertive" tabIndex={-1}>
          <div className="js-password-reset-success status submission-success">
            <h4 className="message-title">Password Reset Complete</h4>
            <div className="message-copy">
              <p>Your password has been reset successfully. You will be redirected to the sign-in page in {countdown} second{countdown !== 1 ? 's' : ''}.</p>
              <p><a href={`${getConfig().LMS_BASE_URL}/login`}>Click here</a> if you are not redirected automatically.</p>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // Determine top-level error message for the form
  let formErrorMessage = null;
  if (errorCode === FORM_SUBMISSION_ERROR) {
    formErrorMessage = ERROR_MESSAGES[FORM_SUBMISSION_ERROR];
  } else if (errorCode === PASSWORD_VALIDATION_ERROR) {
    formErrorMessage = errorMsg || 'Password criteria has not been met';
  } else if (errorCode) {
    formErrorMessage = ERROR_MESSAGES[errorCode] || 'An error occurred. Please try again.';
  }

  return (
    <PageShell>
      <Helmet>
        <title>Reset Password | Subodha</title>
      </Helmet>
      <div className="js-form-feedback" aria-live="assertive" tabIndex={-1}>
        {formErrorMessage && (
          <div className="js-form-errors status submission-error">
            <h4 className="message-title">We couldn&apos;t reset your password.</h4>
            <ul className="message-copy">
              <li>{formErrorMessage}</li>
            </ul>
          </div>
        )}
      </div>
      <h2>Reset Password</h2>
      <form
        id="set-reset-password-form"
        className="login-form"
        tabIndex={-1}
        onSubmit={handleSubmit}
      >
        <div className="form-field">
          <label htmlFor="new-password">
            <span className="label-text">New password</span>
          </label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            className="input-block"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            aria-label="Enter your new password"
            aria-describedby="new-password-error"
            tabIndex={0}
          />
          {formErrors.newPassword && (
            <span id="new-password-error" className="tip error" style={{ color: 'white' }} aria-live="assertive">
              {formErrors.newPassword}
            </span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="confirm-password">
            <span className="label-text">Confirm password</span>
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            className="input-block"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateInput('confirmPassword', e.target.value);
            }}
            onFocus={handleOnFocus}
            aria-label="Confirm your new password"
            aria-describedby="confirm-password-error"
            tabIndex={0}
          />
          {formErrors.confirmPassword && (
            <span id="confirm-password-error" className="tip error" style={{ color: 'white' }} aria-live="assertive">
              {formErrors.confirmPassword}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="action action-primary action-update"
          tabIndex={0}
        >
          Reset password
        </button>
        <div className="register-info-message" style={{ marginTop: '1rem' }}>
          <a href={`${getConfig().LMS_BASE_URL}/login`}>Back to sign in</a>
        </div>
      </form>
    </PageShell>
  );
};

ResetPasswordPage.defaultProps = {
  status: null,
  token: null,
  errorMsg: null,
  errorCode: null,
};

ResetPasswordPage.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  validateToken: PropTypes.func.isRequired,
  token: PropTypes.string,
  status: PropTypes.string,
  errorMsg: PropTypes.string,
  errorCode: PropTypes.string,
};

export default connect(
  resetPasswordResultSelector,
  {
    resetPassword,
    validateToken,
  },
)(ResetPasswordPage);
