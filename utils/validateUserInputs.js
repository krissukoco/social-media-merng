const regExEmail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const regExUsername = /^[a-zA-Z0-9]{3,20}$/;
// PASSWORD CRITERIAS
// 1. At least 8 characters
// 2. At least 1 uppercase & 1 lowercase
// 3. At least 1 numerical characters
// 4. At least 1 non-letternumerical characters: @$!%*?&
const regExPassword =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

module.exports.validateRegister = (input) => {
  const { fullname, email, username, password, confirmPassword } = input;
  var errors = [];

  // TODO: No field should be empty
  for (const key in input) {
    if (input[key] == null) {
      errors.push(`Field ${key} cannot be empty`);
    }
  }

  // TODO: fullname: not only spaces
  if (fullname.trim().length === 0) {
    errors.push('Fullname should not be empty');
  }

  // TODO: email: match with email regEx
  if (!email.match(regExEmail)) {
    errors.push('Email format is not correct');
  }

  // TODO: username: Should not consist of spaces, and non-alphanumeric characters
  if (!username.match(regExUsername)) {
    errors.push('Username format is not correct');
  }

  // TODO: password: Should meet the criterias
  if (!password.match(regExPassword)) {
    errors.push('Password not strong enough');
  }

  // TODO: confirmPassword: should match with password
  if (confirmPassword !== password) {
    errors.push('Passwords do not match');
  }

  return errors;
};

module.exports.validateLogin = (input) => {
  const { emailOrUsername, password } = input;
  var errors = [];

  // TODO: No field should be empty
  for (const key in input) {
    if (input[key] == null) {
      errors.push(`Field ${key} cannot be empty`);
    }
  }

  // TODO: Determine whether an email or username
  const isEmail = emailOrUsername.match(regExEmail);

  return { isEmail, errors };
};
