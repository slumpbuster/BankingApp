const loginRequired = ["deposit", "withdraw", "transaction"];
const adminRequired = ["allData"];

fetch(`/config/firebaseConfig`)
  .then(response => response.json())
  .then(firebaseConfig => {
    firebase.initializeApp(firebaseConfig);
  })
  .catch(err => {
    console.log(err);
  });

const signUp = async (email, password) => {
  const auth = firebase.auth();
  auth.createUserWithEmailAndPassword(email, password)
    .then(user => {
      return user.uid;
    })
    .catch(error => {
      return error;
    });
}

const decrypt = (token, value) => {
  let decUser = atob(token);
  return JSON.parse(decUser)[value];
}

const checkLogin = (header) => {
  let rtn = validateLogin(header);
  if (typeof rtn != "boolean") {
    rtn = true;
  }
  return rtn;
};

const userLoggedOff = () => {
  localStorage.removeItem("uToken");
  localStorage.removeItem("aToken");
}

const invalid = (data) => {
  if (data.error!==undefined) {
    userLoggedOff();
    alert("Session is invalid. Please login again.");
    window.location.href = "#/";
    document.getElementById('login').click();
    return true;
  } else {
    return false;
  }
}

const verifyToken = (token, type) => {
  let role = decrypt(token, "role");
  if (type === role) {
    return true;
  };
  return false;
}
const userLoggedIn = (type) => {
  let sessionUser = localStorage.getItem("uToken");
  if (sessionUser !== null) {
    return verifyToken(sessionUser, type);
  }
  return false;
}
const validateLogin = (header) => {
  let rtn = true;
  if (loginRequired.includes(header.toLowerCase())) {
    rtn = userLoggedIn("user");
  } else if (adminRequired.includes(header.toLowerCase())) {
    rtn = userLoggedIn() && (decrypt(localStorage.getItem("uToken"), "role") === "admin");
  }
  return true;
}

const frmValidate = (formErrors, field, label) => {
  let error = {};
  if (field != undefined) {
    if (!field.toString()) {
      error[`${label}`] = `${label} cannot be empty`;
    } else {
      switch (label) {
        case "password":
          if (field.length < 8) error[`${label}`] = `password must be at least 8 characters`;
          break;
        case "email":
          if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(field) === false) 
            error[`${label}`] = `email is not valid`;
          break;
        case "transaction":
          if (parseFloat(field) < 0) error[`${label}`] = `amount canot be neagative`;
          if (parseFloat(field) === 0) error[`${label}`] = `amount canot be $0`;
          if (isNaN(field)) error[`${label}`] = `amount must be a number`;
          break;
        default:
      }
    }
  }
  formErrors = {...formErrors, ...error};
  return formErrors;
}

const frmOnChange = (e, frmInputs, tmpFrmData) => {
  let tmpSubmit = false;
  tmpFrmData[e.target.name] = e.target.value;
  frmInputs.map((frmInput) => {
    if (tmpFrmData[frmInput] === undefined) {
      tmpSubmit = true;
    } else {
      if (tmpFrmData[frmInput].length <= 0) tmpSubmit = true;
    }
  });
  return tmpSubmit;
}