const Route       = ReactRouterDOM.Route;
const Link        = ReactRouterDOM.Link;
const HashRouter  = ReactRouterDOM.HashRouter;
const UserContext = React.createContext(null);
const loginRequired = ["Deposit", "Withdraw", "Balance"];
let ctxUser = [];

const checkLogin = (users, header) => {
  if (loginRequired.includes(header)) {
    ctxUser = users.filter(user => user.loggedIn === true)[0];
    if (ctxUser === undefined || ctxUser === []){
      document.getElementById('login').click();
      return false;
    }
  }
  return true;
}

const Card = (props) => {
  const cardClasses = () => {
    const bg  = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
    const txt = props.txtcolor ? ' text-' + props.txtcolor: ' text-white';
    return 'card mb-3 ' + bg + txt;
  }
  const hdrClasses = () => {
    const bg  = props.headerbgcolor ? ' bg-' + props.headerbgcolor : props.bgcolor ? ' bg-' + props.bgcolor : ' ';
    const txt = props.headertxtcolor ? ' text-' + props.headertxtcolor: props.txtcolor ? ' text-' + props.txtcolor: ' text-white';
    return 'card-header ' + bg + txt;
  }
  
  return (
    <div className={cardClasses()} style={{maxWidth: "18rem"}}>
      <div className={hdrClasses()}>{props.header}</div>
      <div className="card-body">
        {props.title && (<h5 className="card-title">{props.title}</h5>)}
        {props.text && (<p className="card-text">{props.text}</p>)}
        {props.body}
        {props.status && (<div className="text-warning">{props.status}</div>)}
      </div>
    </div>      
  );    
}

const Form = (props) => {
  const [status, setStatus] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [show, setShow] = React.useState(true);
  let newErrors = {};

  if (!checkLogin(props.users, props.header)) return;
  
  const validate = (field, label) => {
    let error = {};
    if (field != undefined) {
      if (!field.toString()) {
        error[`${label}`] = `${label} cannot be empty`;
        //setTimeout(() => setStatus(''),3000);
      } else {
        switch (label) {
          case "transaction":
            if (parseInt(field) < 0) {
              error[`${label}`] = `Amount canot be neagative`;
            }
            break;
          case "email":
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(field) === false) {
              error[`${label}`] = `Email is not valid`;
            }
            break;
          default:
        }
      }
    }
    newErrors = {...newErrors, ...error};
    setErrors(newErrors);
    if (JSON.stringify(error) === '{}') return true;
    return false;
  }

  const clearForm = (e) => {
    setShow(true);
  }  

  const onSubmit = (e) => {
    let formElements=e.target;
    let data = {}; 
    let frmData = {}; 
    let rtn = true;

    newErrors = {};
    for (var i=0; i<formElements.length; i++) {
      if (formElements[i].type!="submit") frmData[formElements[i].name]=formElements[i].value;
    }

    validate(frmData.name, "name") ? data.name = frmData.name : rtn = false;
    validate(frmData.email, "email") ? data.email = frmData.email : rtn = false;
    validate(frmData.password, "password") ? data.password = frmData.password : rtn = false;
    validate(frmData.balance, "balance") ? (frmData.balance != undefined ? data.balance = parseInt(frmData.balance) : data.balance = 0) : rtn = false;
    if (frmData.transaction != undefined) validate(frmData.transaction, "transaction") ? data.transaction = parseInt(frmData.transaction) : rtn = false;

    if (rtn) {
      setStatus('');
      rtn = props.handle(data);
      if (rtn === true) {
        setErrors({});
        setShow(false);
      } else {
        setStatus(`Error: ${rtn}`);
        rtn = false;
      }
    }
    if (!rtn) e.preventDefault();
  }
  
  return (
    <Card
      bgcolor="secondary"
      headerbgcolor="dark"
      header={props.header}
      status={status}
      body={show ? (
        <form id="form" onSubmit={(e) => {onSubmit(e)}}>
          {props.elems.map((elem) => (
            <div key={elem.name}>
              {elem.elem === "header" ? <h4>{elem.label}{elem.user ? ctxUser[`${elem.value}`] : elem.value}</h4> : <></>}
              {elem.elem === "input" ?
                (<>
                  {elem.label ? <>{elem.label}<br/></> : <></>}
                  <input type={elem.type} className="form-control" name={elem.name} placeholder={(elem.holder ? elem.holder : "")} defaultValue={elem.user ? ctxUser[`${elem.value}`] : elem.value} autoFocus={elem.focus ? true :false}/>
                  {elem.type != "hidden" ?
                    (<>
                      {errors[`${elem.name}`] && (<div className="text-warning">{errors[`${elem.name}`]}</div>)}
                      <br/>
                    </>):(<></>)
                  }
                </>):(<></>)
              }
            </div>
          ))}
          <br/>
          <button type="submit" className="btn btn-light">{props.submit}</button>
        </form>
        ):(
          <>
          <h5>Success</h5>
          <button className="btn btn-light" onClick={(e) => {clearForm(e)}}>{props.success}</button>
          </>
        )
      }
    />
  )
}

const Info = (props) => {
  let newProps = {...props};
  if (!checkLogin(props.users, props.header)) return;

  switch (props.header) {
    case "Balance":
      newProps.title=ctxUser.name;
      newProps.text=`Balance $${ctxUser.balance}`;
      break;
    default:
  }

  return (
    <Card
      headerbgcolor="dark"
      headertxtcolor="white"
      txtcolor="black"
      header={newProps.header}
      title={newProps.title}
      text={newProps.text}
      body={newProps.body}
    />
  )
}