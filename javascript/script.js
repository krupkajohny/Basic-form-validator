'use strict';

//////////////////////////////////////
// Selecting elements

const form = document.querySelector('#form');
const userNameInputEl = document.querySelector('#username');
const emailInputEl = document.querySelector('#email');
const passwordInputElement = document.querySelector('#password');
const passwordConfirmInputEl = document.querySelector('#password2');
const submitBtnEl = document.querySelector('.submit-btn');

//////////////////////////////////////
// FUNCTIONS

const getFieldName = (inputEl) => {
  return inputEl.id.slice(0, 1).toUpperCase() + inputEl.id.slice(1);
};

const showSuccessMsg = (inputEl) => {
  const formControl = inputEl.closest('.form-control');

  formControl.classList.remove('error');
  formControl.classList.add('success');
};

const showErrorMsg = (inputEl, errorMessage) => {
  const formControl = inputEl.closest('.form-control');

  formControl.classList.remove('success');
  formControl.classList.add('error');
  formControl.querySelector('small').innerText = errorMessage;
};

const requiredInputsCheck = (inputsStatesObject, inputsArr) => {
  inputsArr.forEach((input) => {
    const inputNotEmpty = input.value.length >= 1;
    inputsStatesObject[getFieldName(input)] = inputNotEmpty;
    inputNotEmpty ? showSuccessMsg(input) : showErrorMsg(input, `${getFieldName(input)} is required!`);
  });
};

const validEmailCheck = (emailInput) => {
  const validEmail = String(emailInput.value)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  validEmail ? showSuccessMsg(emailInput) : showErrorMsg(emailInput, `${getFieldName(emailInput)} is not valid!`);

  return validEmail;
};

const lengthCheck = (passInput, minLength, maxLength) => {
  // Ended up not using Regex check
  // const validPass = String(passInput.value).match(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z]{4,}$/);
  // // (?=.*[a-z])       //should contain at least one lower case
  // // (?=.*[A-Z])       //should contain at least one upper case
  // // [a-zA-Z0-9]{3,}   //should contain at least 4 from the mentioned characters

  if (passInput.value.length < minLength) {
    showErrorMsg(passInput, `${getFieldName(passInput)} must be at lest ${minLength} characters`);
  } else if (passInput.value.length > maxLength) {
    showErrorMsg(passInput, `${getFieldName(passInput)} must be max ${maxLength} characters`);
  } else {
    showSuccessMsg(passInput);
    return true;
  }
};

const passMatChecker = (firstPassInput, secondPassInput) => {
  const passMatch = firstPassInput.value === secondPassInput.value;

  passMatch ? showSuccessMsg(secondPassInput) : showErrorMsg(secondPassInput, `Passwords don't match!`);

  return passMatch;
};

//////////////////////////////////////
// EVENT LISTENER

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const requiredInputsFilled = {};

  // Required inputs check
  requiredInputsCheck(requiredInputsFilled, [userNameInputEl, emailInputEl, passwordInputElement, passwordConfirmInputEl]);

  // User name length validation
  if (requiredInputsFilled[getFieldName(userNameInputEl)]) lengthCheck(userNameInputEl, 3, 15);

  // // Email validation
  if (requiredInputsFilled[getFieldName(emailInputEl)]) validEmailCheck(emailInputEl);

  // // Password validation
  let validPass = false;
  if (requiredInputsFilled[getFieldName(passwordInputElement)]) validPass = lengthCheck(passwordInputElement, 3, 10);

  // if (requiredInputsFilled[getFieldName(passwordConfirmInputEl)]) validPassCheck(passwordInputElement, 3, 10);
  if (requiredInputsFilled[getFieldName(passwordConfirmInputEl)]) {
    if (validPass) {
      passMatChecker(passwordInputElement, passwordConfirmInputEl);
    } else {
      showErrorMsg(passwordConfirmInputEl, 'Valid password is required!');
    }
  }
});
