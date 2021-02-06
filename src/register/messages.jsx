import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'create.account.button': {
    id: 'create.account.button',
    defaultMessage: 'Create Account',
    description: 'Button label that appears on register page',
  },
  'already.have.an.edx.account': {
    id: 'already.have.an.edx.account',
    defaultMessage: 'Already have an edX account?',
    description: 'A message on registration page asking the user if he already has an edX account',
  },
  'sign.in.hyperlink': {
    id: 'sign.in.hyperlink',
    defaultMessage: 'Sign in.',
    description: 'Text for the hyperlink that takes user to login page',
  },
  'create.an.account.using': {
    id: 'create.an.account.using',
    defaultMessage: 'or create an account using',
    description: 'A message that after optional form fields checkbox',
  },
  'create.a.new.account': {
    id: 'create.a.new.account',
    defaultMessage: 'Create a new account',
    description: 'Text that appears before social auth buttons and before the registration form',
  },
  'register.institution.login.button': {
    id: 'register.institution.login.button',
    defaultMessage: 'Use my institution/campus credentials',
    description: 'shows institutions list',
  },
  'register.institution.login.page.title': {
    id: 'register.institution.login.page.title',
    defaultMessage: 'Register with institution/campus credentials',
    description: 'Heading of institution page',
  },
  'create.an.account': {
    id: 'create.an.account',
    defaultMessage: 'Create an Account',
    description: 'Message on button to return to register page',
  },
  'register.page.email.label': {
    id: 'register.page.email.label',
    defaultMessage: 'Email (required)',
    description: 'Label that appears above email field on register page',
  },
  'email.validation.message': {
    id: 'email.validation.message',
    defaultMessage: 'Please enter your Email.',
    description: 'Validation message that appears when email address is empty',
  },
  'email.ratelimit.less.chars.validation.message': {
    id: 'email.ratelimit.less.chars.validation.message',
    defaultMessage: 'Email must have 3 characters.',
    description: 'Validation message that appears when email address is less than 3 characters',
  },
  'email.ratelimit.incorrect.format.validation.message': {
    id: 'email.ratelimit.incorrect.format.validation.message',
    defaultMessage: 'The email address you provided isn\'t formatted correctly.',
    description: 'Validation message that appears when email address is not formatted correctly with no backend validations available.',
  },
  'email.ratelimit.password.validation.message': {
    id: 'email.ratelimit.password.validation.message',
    defaultMessage: 'Your password must contain at least 8 characters',
    description: 'Validation message that appears when password is not formatted correctly with no backend validations available.',
  },
  'password.label': {
    id: 'password.label',
    defaultMessage: 'Password (required)',
    description: 'Label that appears above password field',
  },
  'register.page.password.validation.message': {
    id: 'register.page.password.validation.message',
    defaultMessage: 'Please enter your Password.',
    description: 'Validation message that appears when password is non compliant with edX requirement',
  },
  'fullname.label': {
    id: 'fullname.label',
    defaultMessage: 'Full Name (required)',
    description: 'Label that appears above fullname field',
  },
  'fullname.validation.message': {
    id: 'fullname.validation.message',
    defaultMessage: 'Please enter your Full Name.',
    description: 'Validation message that appears when fullname is empty',
  },
  'username.label': {
    id: 'username.label',
    defaultMessage: 'Public Username (required)',
    description: 'Label that appears above username field',
  },
  'username.validation.message': {
    id: 'username.validation.message',
    defaultMessage: 'Please enter your Public Username.',
    description: 'Validation message that appears when username is invalid',
  },
  'username.format.validation.message': {
    id: 'username.format.validation.message',
    defaultMessage: 'Usernames can only contain letters (A-Z, a-z), numerals (0-9), underscores (_), and hyphens (-).',
    description: 'Validation message that appears when username format is invalid',
  },
  'username.character.validation.message': {
    id: 'username.character.validation.message',
    defaultMessage: 'Your password must contain at least 1 letter.',
    description: 'Validation message that appears when password does not contain letter',
  },
  'username.number.validation.message': {
    id: 'username.number.validation.message',
    defaultMessage: 'Your password must contain at least 1 number.',
    description: 'Validation message that appears when password does not contain number',
  },
  'username.ratelimit.less.chars.message': {
    id: 'username.ratelimit.less.chars.message',
    defaultMessage: 'Public Username must have atleast 2 characters.',
    description: 'Validation message that appears when username is less than 2 characters and with no backend validations available.',
  },
  'country.validation.message': {
    id: 'country.validation.message',
    defaultMessage: 'Select your country or region of residence.',
    description: 'Validation message that appears when country is not selected',
  },
  'support.education.research': {
    id: 'support.education.research',
    defaultMessage: 'Support education research by providing additional information. (Optional)',
    description: 'Text for a checkbox to ask user for if they are willing to provide extra information for education research',
  },
  'register.optional.label': {
    id: 'register.optional.label',
    defaultMessage: '(optional)',
    description: 'Text that appears with optional field labels',
  },
  'registration.request.server.error': {
    id: 'registration.request.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your Internet connection.',
    description: 'error message on server error.',
  },
  'registration.request.failure.header': {
    id: 'registration.request.failure.header',
    defaultMessage: 'We couldn\'t create your account.',
    description: 'error message when registration failure.',
  },
});

export default messages;