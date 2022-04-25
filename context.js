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
        {props.status && (<div id='createStatus'>{props.status}</div>)}
      </div>
    </div>      
  );    
}

const Form = (props) => {
  const [status, setStatus] = React.useState('');
  const [show, setShow] = React.useState(true);
  let newProps = {};

  if (!checkLogin(props.users, props.header)) return;
  
  newProps.header=props.header;
  switch (props.header) {
      case "CreateAccount":
        newProps.header="Create Account";
        newProps.success="Add another account";
        break;
    case "Deposit":
      newProps.success="Add another deposit";
      break;
    case "Withdraw":
      newProps.success="Take another Withdraw";
      break;
    default:
  }
  newProps.submit=newProps.header;
  
  const validate = (field, label) => {
    if (field != undefined) {
      if (!field.toString()) {
        setStatus('Error: ' + label);
        //setTimeout(() => setStatus(''),3000);
        return false;
      } else {
        switch (label) {
          case "transaction":
            if (parseInt(field) < 0) {
              setStatus('Error: amount canot be neagative');
              return false;
            }
            break;
          case "email":
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(field) === false) {
              setStatus('Error: email is not valid');
              return false;
            }
            break;
          default:
        }
      }
    }
    return true;
  }

  const clearForm = (e) => {
    setShow(true);
  }  

  const onSubmit = (e) => {
    let formElements=e.target;
    let data = {}; 
    let frmData = {}; 
    for (var i=0; i<formElements.length; i++) {
      if (formElements[i].type!="submit") frmData[formElements[i].name]=formElements[i].value;
    }
    let rtn = true;
    validate(frmData.name, "name") ? data.name = frmData.name : rtn = false;
    validate(frmData.email, "email") ? data.email = frmData.email : rtn = false;
    validate(frmData.password, "password") ? data.password = frmData.password : rtn = false;
    validate(frmData.balance, "balance") ? (frmData.balance != undefined ? data.balance = parseInt(frmData.balance) : data.balance = 0) : rtn = false;
    if (frmData.transaction != undefined) validate(frmData.transaction, "transaction") ? data.transaction = parseInt(frmData.transaction) : rtn = false;
    if (rtn) {
      setStatus('');
      rtn = props.handle(data);
      if (rtn === true) {
        setShow(false);
      } else {
        setStatus(`Error: ${rtn}`);
        rtn = false;
      }
    }
    if (!rtn) e.preventDefault();
  }

  const FormDisplay = () => {
    switch (props.header) {
      case "Login":
        return (
          <>
            Email address<br/>
            <input type="input" className="form-control" name="email" placeholder="Enter email"/><br/>
            Password<br/>
            <input type="password" className="form-control" name="password" placeholder="Enter password"/><br/>
          </>
        )
        break;
        case "CreateAccount":
          return (
            <>
              Name<br/>
              <input type="input" className="form-control" name="name" placeholder="Enter name"/><br/>
              Email address<br/>
              <input type="input" className="form-control" name="email" placeholder="Enter email"/><br/>
              Password<br/>
              <input type="password" className="form-control" name="password" placeholder="Enter password"/><br/>
              <input type="hidden" className="form-control" name="balance" value="0"/>
            </>
          )
          break;
      case "Deposit":
        return (
          <>
            <h4>{ctxUser.name}</h4>
            <h4>Balance ${ctxUser.balance}</h4>
            Deposit Amount<br/>
            <input type="number" min="0" className="form-control" name="transaction" placeholder="Deposit Amount"/><br/>
            <input type="hidden" className="form-control" name="balance" value={ctxUser.balance}/>
            <input type="hidden" className="form-control" name="email" value={ctxUser.email}/>
          </>
        )
        break;
      case "Withdraw":
        return (
          <>
            <h4>{ctxUser.name}</h4>
            <h4>Balance ${ctxUser.balance}</h4>
            Withdraw Amount<br/>
            <input type="number" min="0" className="form-control" name="transaction" placeholder="Withdraw Amount"/><br/>
            <input type="hidden" className="form-control" name="balance" value={ctxUser.balance}/>
            <input type="hidden" className="form-control" name="email" value={ctxUser.email}/>
          </>
        )
        break;
      default:
        return (
          <>
          </>
        )
    }
  }

  return (
    <Card
      bgcolor="secondary"
      headerbgcolor="dark"
      header={newProps.header}
      status={status}
      body={show ? (
        <form id="form" onSubmit={(e) => {onSubmit(e)}}>
          <FormDisplay />
          <button type="submit" className="btn btn-light">{newProps.submit}</button>
        </form>
        ):(
          <>
          <h5>Success</h5>
          <button className="btn btn-light" onClick={(e) => {clearForm(e)}}>{newProps.success}</button>
          </>
        )
      }
    />
  )
}

const Info = (props) => {
  let newProps = {};
  if (!checkLogin(props.users, props.header)) return;

  switch (props.header) {
    case "Balance":
      newProps.header=props.header;
      newProps.title=ctxUser.name;
      newProps.text=`Balance $${ctxUser.balance}`;
      break;
    case "Home":
      newProps.header="BadBank Landing Module";
      newProps.title="Welcome to the bank";
      newProps.text="You can move around using the navigation bar.";
      newProps.body=(<img src="bank.png" className="img-fluid" alt="Responsive image"/>)
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