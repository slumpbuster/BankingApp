const CreateAccount = (props) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [user, setUser] = React.useState(null);
  const {create} = props;
  const [frmData, setFrmData] = React.useState({});
  const header = create ? "Create Account" : "Update Account";
  const elems = [
    {elem:"input", type:"text", label:"Name", name:"name", holder:"Enter name", value:user!==null ? user.name : frmData.name !== undefined ? frmData.name : "", focus:true},
    {elem:"input", type:"email", label:"Email address", name:"email", holder:"Enter email (Format name@domain.com)", pattern:"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$", value:user!==null ? user.email : frmData.email !== undefined ? frmData.email : "", disabled:!create},
    {elem:"input", type:create ? "password" : "hidden", label:"Password", name:"password", holder:"Enter password (Minimum 8 charachters)", pattern:".{8,}", value:user!==null ? user.password : frmData.password !== undefined ? frmData.password : ""},
    {elem:"input", type:"date", label:"Date of Birth", name:"dob", holder:"Enter date of birth", value:user!==null ? formatDate(user.dob) : frmData.dob !== undefined ? formatDate(frmData.dob) : ""},
    {elem:"input", type:"tel", label:"Phone", name:"phone", holder:"Enter phone", holder:"Enter phone (Format: 123.456.7890)", pattern:"[0-9]{3}.[0-9]{3}.[0-9]{4}",  value:user!==null ? user.phone : frmData.phone !== undefined ? frmData.phone : ""},
    {elem:"input", type:"text", label:"Street Address", name:"address", holder:"Enter street address", value:user!==null ? user.address : frmData.address !== undefined ? frmData.address : ""},
    {elem:"input", type:"text", label:"City, State Zip", name:"csz", holder:"Enter city, state zip", value:user!==null ? user.csz : frmData.csz !== undefined ? frmData.csz : ""},
    {elem:"input", type:create ? "checkbox" : "hidden", label:"Savings Account", name:"savings", value:user!==null && user.accounts!==undefined && user.accounts.filter(account => account.type === "Savings").length > 0 ? 1 : frmData.savings !== undefined ? frmData.savings : 0},
    {elem:"input", type:create ? "checkbox" : "hidden", label:"Checking Account", name:"checking", value:user!==null && user.accounts!==undefined && user.accounts.filter(account => account.type === "Checking").length > 0 ? 1 : frmData.checking !== undefined ? frmData.checking : 0},
    {elem:"input", type:"hidden", name:"balance", value:"0"}
  ]
  const urlHeader = {headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("aToken")
  }}
  
  const loadData = () => {
    if (!create) {
      fetch(`/account/findAuth/`, urlHeader)
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          if (!invalid(data)) {
            data.balance = data.balance.length === 0 ? 0 : parseFloat(data.balance);
            setUser(data);
          } else {
            setError(true);
          }
        })
        .catch(error => {
          setLoading(false);
          setError(true);
        });
    } else {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    loadData();
  }, []);

  const clearForm = () => {
    setFrmData({});
    setShow(true);
    loadData();
  }

  const handle = (data) => {
    setStatus('');
    setFrmData(data);
    if (create) {
      if (parseInt(data.savings)===0 && parseInt(data.checking)===0) {
        setStatus('At least one account must be selected');
        return;
      } else {
        fetch(`/account/findOne/${data.email}`)
          .then(response => response.json())
          .then(user => {
            if (user.user !== undefined) {
              setStatus("Error: email already exists");
              return;
            } else {
              const auth = firebase.auth();
              auth.createUserWithEmailAndPassword(data.email, data.password)
                .then(user => {
                  fetch(`/account/create/${user.user.uid}/${data.name}/${data.email}/${data.password}/${data.dob.replaceAll('/', '-')}/${data.phone}/${data.address}/${data.csz}/${data.savings}/${data.checking}`, urlHeader)
                    .then(response => response.json())
                    .then(respData => {
                      setFrmData({});
                      setShow(false);
                    })
                    .catch(error => {
                      setStatus(error.message);
                      return;
                    });
                })
                .catch(error => {
                  setStatus(error.message);
                  return;
                });
            }
        })
        .catch(error => {
          setStatus("Error: account not created");
        });
      }
    } else {
      fetch(`/account/update/${data.name}/${data.dob.replaceAll('/', '-')}/${data.phone}/${data.address}/${data.csz}`, urlHeader)
        .then(response => response.json())
        .then(data => {
          setStatus('');
          setShow(false);
        })
        .catch(error => {
          setStatus(error.message);
          return;
        });
    }
  }

  if (loading) {
    return (
      <Info
        header="BadBank MERN Application"
        title="Please wait while we load your account information."
        body={(<img src="./assets/images/Loading.gif" className="img-fluid" alt="Loading"/>)}
      />
    )
  } else if (error) {
    return (
      <Info
        header="BadBank MERN Application"
        title="An Error has occured. Please try logging in again."
        body={(<img src="./assets/images/Error.jpg" className="img-fluid" alt="Error"/>)}
      />
    )
  } else if (!create && !(checkLogin(header))) {
    return (
      <Info
        header={header}
        title="No user logged in"
        text={`Please log in to make a ${header.toLowerCase()}.`}
      />
    )
  } else {
    return (
      <Form
        header={header}
        success={`${create ? "Add another account" : "Account updated"}`}
        handle={handle}
        clearForm={clearForm}
        show={show}
        status={status}
        elems={elems}
        frmData={frmData}
      />
    )
  }
}