const Route       = ReactRouterDOM.Route;
const Link        = ReactRouterDOM.Link;
const HashRouter  = ReactRouterDOM.HashRouter;
const UserContext = React.createContext(null);
const maxWidth = "30rem";
let ctxUser = [];

const checkLogin = (users, header) => {
  let rtn = validateLogin(users, header);
  if (typeof rtn != "boolean") {
    ctxUser = rtn;
    rtn = true;
  }
  return rtn;
};

const Card = (props) => {
  return (
    <div className={cardClasses(props.bgcolor, props.txtcolor)} style={{maxWidth: props.maxWidth ? props.maxWidth : maxWidth}}>
      <div className={hdrClasses(props.headerbgcolor, props.headertxtcolor, props.bgcolor, props.txtcolor)}>{props.header}</div>
      <div className="card-body">
        {props.title && (<h5 className="card-title">{props.title}</h5>)}
        {props.text && (<p className="card-text">{props.text}</p>)}
        {props.body}
        {props.status && (<div className="text-danger warning">{props.status}</div>)}
      </div>
    </div>      
  );    
}

const Info = (props) => {  
  return (
    <Card
      headerbgcolor="secondary"
      headertxtcolor="dark"
      txtcolor="dark"
      header={props.header}
      title={props.title}
      text={props.text}
      body={props.body}
      maxWidth={props.maxWidth}
    />
  )
}

const Form = (props) => {
  const [status, setStatus] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [frmData, setFrmData] = React.useState({});
  const [frmInputs, setFrmInputs] = React.useState([]);
  const [show, setShow] = React.useState(true);
  const [submit, setSubmit] = React.useState(true);
  let formErrors = {};
  
  const clearForm = (e) => {setShow(true);}

  const validate = (field, label) => {
    formErrors = frmValidate(formErrors,field, label);
    setErrors(formErrors);
    if (JSON.stringify(formErrors) === '{}') return true;
    return false;
  }

  const onChange = (e) => {
    let tmpFrmData = {...frmData};
    let rtn = frmOnChange(e, frmInputs, tmpFrmData);
    setFrmData(tmpFrmData);
    setSubmit(rtn);
  }

  const onSubmit = (e) => {
    e.preventDefault();
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
  }, []);

  return (
    <Card
      bgcolor="light"
      headerbgcolor="secondary"
      txtcolor="dark"
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
                      {errors[`${elem.name}`] && (<div className="text-warning warning">{errors[`${elem.name}`]}</div>)}
                      <br/>
                    </>):(<></>)
                  }
                </>):(<></>)
              }
            </div>
          ))}
          <br/>
          <button type="submit" className="btn btn-secondary" disabled={submit}>{(props.submit ? props.submit : props.header)}</button>
        </form>
        ):(
          <>
          <h5 className="text-success">Success</h5>
          <button className="btn btn-secondary" onClick={(e) => {clearForm(e)}}>{props.success}</button>
          </>
        )
      }
    />
  )
}