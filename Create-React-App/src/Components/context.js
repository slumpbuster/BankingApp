import React, { useState, useEffect, createContext } from "react";
import { validateLogin, frmValidate, frmOnChange } from '../Middleware/logic';
import { cardClasses, hdrClasses } from '../Middleware/styles';

const UserContext = createContext(null);

const maxWidthDefault = "30rem";
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
  const {bgcolor, txtcolor, headerbgcolor, headertxtcolor, header, title, text, body, status, maxWidth} = props;
  return (
    <div className={cardClasses(bgcolor, txtcolor)} style={{margin: "2em", maxWidth: maxWidth ? maxWidth : maxWidthDefault}}>
      <div className={hdrClasses(headerbgcolor, headertxtcolor, bgcolor, txtcolor)}>{header}</div>
      <div className="card-body">
        {title && (<h5 className="card-title">{title}</h5>)}
        {text && (<p className="card-text">{text}</p>)}
        {body}
        {status && (<div className="text-danger warning">{status}</div>)}
      </div>
    </div>      
  );    
}

const Info = (props) => {
  const {header, title, text, body, maxWidth} = props;
  return (
    <Card
      headerbgcolor="secondary"
      headertxtcolor="dark"
      txtcolor="dark"
      header={header}
      title={title}
      text={text}
      body={body}
      maxWidth={maxWidth}
    />
  )
}

const Form = (props) => {
  const {header, submit, success, elems} = props;
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [frmData, setFrmData] = useState({});
  const [frmInputs, setFrmInputs] = useState([]);
  const [show, setShow] = useState(true);
  const [submitBtn, setSubmitBtn] = useState(true);
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
    setSubmitBtn(rtn);
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

  useEffect(() => {
    let tmpFrmInputs = [];
    let tmpFrmData = {};
    elems.map((elem) => {
      if (elem.elem === "input") {
        if (["input", "password", "number", "hidden"].includes(elem.type)) {
          tmpFrmData[elem.name] = elem.user ? ctxUser[`${elem.value}`] : elem.value;
          tmpFrmInputs.push(elem.name);
        }
      };
    });
    setFrmInputs(tmpFrmInputs);
    setFrmData(tmpFrmData);
  }, [elems]);

  return (
    <Card
      bgcolor="light"
      headerbgcolor="secondary"
      txtcolor="dark"
      header={header}
      status={status}
      body={show ? (
        <form id="form" onSubmit={(e) => {onSubmit(e)}}>
          {elems.map((elem) => (
            <div key={elem.name}>
              {elem.elem === "header" ? <h4>{elem.label}{elem.user ? ctxUser[`${elem.value}`] : elem.value}</h4> : <></>}
              {elem.elem === "input" ?
                (<>
                  {elem.label ? <>{elem.label}<br/></> : <></>}
                  <input type={elem.type} step={(elem.step ? elem.step : "any")} className="form-control" name={elem.name} placeholder={(elem.holder ? elem.holder : "")} defaultValue={elem.user ? ctxUser[`${elem.value}`] : elem.value} autoFocus={elem.focus ? true :false} onChange={(e) => {onChange(e)}}/>
                  {elem.type !== "hidden" ?
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
          <button type="submit" className="btn btn-secondary" disabled={submitBtn}>{(submit ? submit : header)}</button>
        </form>
        ):(
          <>
          <h5 className="text-success">Success</h5>
          <button type="button"className="btn btn-secondary" onClick={(e) => {clearForm(e)}}>{success}</button>
          </>
        )
      }
    />
  )
}

export { UserContext, Card, Info, Form, checkLogin }