const Route       = ReactRouterDOM.Route;
const Link        = ReactRouterDOM.Link;
const HashRouter  = ReactRouterDOM.HashRouter;
const UserContext = React.createContext(null);
const loginRequired = ["deposit", "withdraw"];
let ctxUser = [];

const checkLogin = (users, header) => {
  if (loginRequired.includes(header)) {
    ctxUser = users.filter(user => user.loggedIn === true)[0];
    if (ctxUser === undefined || ctxUser === []){
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
    <div className={cardClasses()} style={{maxWidth: "30rem"}}>
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
  const [frmData, setFrmData] = React.useState({});
  const [frmInputs, setFrmInputs] = React.useState([]);
  const [show, setShow] = React.useState(true);
  const [submit, setSubmit] = React.useState(true);
  let formErrors = {};

  if (!checkLogin(props.users, props.header)) return;
  
  const validate = (field, label) => {
    let error = {};
    if (field != undefined) {
      if (!field.toString()) {
        error[`${label}`] = `${label} cannot be empty`;
        //setTimeout(() => setStatus(''),3000);
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
            break;
          default:
        }
      }
    }
    formErrors = {...formErrors, ...error};
    setErrors(formErrors);
    if (JSON.stringify(error) === '{}') return true;
    return false;
  }
  
  const clearForm = (e) => {
    setShow(true);
  }
  
  const onChange = (e) => {
    let tmpFrmData = {...frmData};
    let tmpSubmit = false;
    tmpFrmData[e.target.name] = e.target.value;
    frmInputs.map((frmInput) => {
      if (tmpFrmData[frmInput] === undefined) {
        tmpSubmit = true;
      } else {
        if (tmpFrmData[frmInput].length <= 0) tmpSubmit = true;
      }
    });
    setFrmData(tmpFrmData);
    setSubmit(tmpSubmit);
  }

  const onSubmit = (e) => {
    let rtn = true;

    formErrors = {};
    frmInputs.map((frmInput) => {
      if (!validate(frmData[frmInput], frmInput)) rtn = false;
    });
    
    if (rtn) {
      setStatus('');
      rtn = props.handle(frmData);
      if (rtn === true) {
        setErrors({});
        setShow(false);
      } else {
        setStatus(rtn);
        rtn = false;
      }
    }
    if (!rtn) e.preventDefault();
  }
  React.useEffect(() => {
    let tmpFrmInputs = [];
    let tmpFrmData = {};
    props.elems.map((elem) => {
      if (elem.elem === "input") {
        if (["input", "password", "number", "hidden"].includes(elem.type)) {
          tmpFrmData[elem.name] = elem.user ? ctxUser[`${elem.value}`] : elem.value;
          tmpFrmInputs.push(elem.name);
        }
      };
    });
    setFrmInputs(tmpFrmInputs);
    setFrmData(tmpFrmData);
  }, [])
  
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
                  <input type={elem.type} step={(elem.step ? elem.step : "any")} className="form-control" name={elem.name} placeholder={(elem.holder ? elem.holder : "")} defaultValue={elem.user ? ctxUser[`${elem.value}`] : elem.value} autoFocus={elem.focus ? true :false} onChange={(e) => {onChange(e)}}/>
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
          <button type="submit" className="btn btn-light" disabled={submit}>{props.submit}</button>
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