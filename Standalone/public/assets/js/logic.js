const loginRequired = ["deposit", "withdraw", "transaction", "editAccount"];
const employeeRequired = ["allData"];

fetch(`/config/firebaseConfig`, {method: 'GET'})
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
  try {
    return JSON.parse(decUser)[value]!==undefined ?JSON.parse(decUser)[value] : undefined;
  } catch (error) {
    return null;
  }
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
  ctx = null;
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
  } else if (employeeRequired.includes(header.toLowerCase())) {
    rtn = userLoggedIn() && (decrypt(localStorage.getItem("uToken"), "role") === "employee");
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
  if (e.target.type === "checkbox") {
    tmpFrmData[e.target.name] = e.target.checked ? 1 : 0;
  } else {
    tmpFrmData[e.target.name] = e.target.value;
  }
  frmInputs.map((frmInput) => {
    if (tmpFrmData[frmInput] === undefined) {
      tmpSubmit = true;
    } else {
      if (tmpFrmData[frmInput].length <= 0) tmpSubmit = true;
    }
  });
  return tmpSubmit;
}

const formatDate = (datetime) => {
  let dt=new Date(datetime);
  let dd = (dt.getDate()).toString();
  let mm = (dt.getMonth()+1).toString();
  let yy = (dt.getFullYear()).toString();
  if (dd!=="NaN" && dd.length === 1) dd = "0" + dd;
  if (mm!=="NaN" && mm.length === 1) mm = "0" + mm;
  return dd!=="NaN" && mm!=="NaN" && yy!="NaN" ? `${yy}-${mm}-${dd}` : "";
}

const createUToken = (user, account) => {
  let tmpCtx = {"name": user.name, "role":user.role, account: account};
  if (user.balance !== undefined) tmpCtx.balance = user.balance.length === 0 ? 0 : parseFloat(user.balance);
  let encUser = btoa(JSON.stringify(tmpCtx));
  localStorage.setItem('uToken',encUser);
  return tmpCtx;
}