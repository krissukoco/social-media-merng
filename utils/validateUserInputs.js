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

module.exports.isPasswordStrong = (password) => {
  return password.match(regExPassword);
};

module.exports.validateRegister = (input) => {
  const { fullname, email, username, password, confirmPassword } = input;
  var errors = [];

  // No field should be empty
  for (const key in input) {
    if (input[key] == null || input[key].trim().length === 0) {
      errors.push(`Field ${key} cannot be empty`);
    }
  }

  // email: match with email regEx
  if (!email.match(regExEmail)) {
    errors.push('Email format is not correct');
  }

  // username: Should not consist of spaces, and non-alphanumeric characters
  if (!username.match(regExUsername)) {
    errors.push('Username format is not correct');
  }

  // password: Should meet the criterias
  if (!password.match(regExPassword)) {
    errors.push('Password not strong enough');
  }

  // confirmPassword: should match with password
  if (confirmPassword !== password) {
    errors.push('Passwords do not match');
  }

  return errors;
};

module.exports.validateLogin = (input) => {
  const { emailOrUsername, password } = input;
  var errors = [];

  // No field should be empty
  for (const key in input) {
    if (input[key] == null) {
      errors.push(`Field ${key} cannot be empty`);
    }
  }

  // Determine whether an email or username
  const isEmail = emailOrUsername.match(regExEmail);

  return { isEmail, errors };
};

module.exports.validateUpdate = (input) => {
  let errors = [];
  let valid = false;
  let validatedInput;

  try {
    let { username, fullname, email, bio, location } = input;
  } catch (e) {
    errors.push('Update input fields not complete');
    return { valid, errors, validatedInput };
  }

  let { username, fullname, email, bio, location } = input;
  for (let field of [{ username }, { name: fullname }, { email }]) {
    if (!field || Object.values(field)[0].trim().length === 0) {
      errors.push(
        `${Object.keys(field)[0].toUpperCase()} field cannot be empty`
      );
    }
  }

  // Username validation
  if (!username.match(regExUsername)) {
    errors.push('Username format is not correct');
  }

  // Email validation
  if (!email.match(regExEmail)) {
    errors.push('Email format is not correct');
  }

  // Make bio and location empty if only spaces
  if (bio) {
    bio = bio.trim();
  } else {
    bio = '';
  }
  if (location) {
    location = location.trim();
  } else {
    location = '';
  }

  validatedInput = { username, fullname, email, bio, location };

  valid = errors.length === 0 ? true : false;
  return { valid, errors, validatedInput };
};
