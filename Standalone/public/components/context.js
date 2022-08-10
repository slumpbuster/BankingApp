const Route       = ReactRouterDOM.Route;
const Link        = ReactRouterDOM.Link;
const HashRouter  = ReactRouterDOM.HashRouter;
const UserContext = React.createContext();
const maxWidth = "30rem";

const cardClasses = (bgcolor, txtcolor) => {
  const bg  = bgcolor ? ' bg-' + bgcolor : ' ';
  const txt = txtcolor ? ' text-' + txtcolor: ' text-white';
  return 'card mb-3 ' + bg + txt;
}
const hdrClasses = (headerbgcolor, headertxtcolor, bgcolor, txtcolor) => {
  const bg  = headerbgcolor ? ' bg-' + headerbgcolor : bgcolor ? ' bg-' + bgcolor : ' ';
  const txt = headertxtcolor ? ' text-' + headertxtcolor: txtcolor ? ' text-' + txtcolor: ' text-white';
  return 'card-header header ' + bg + txt;
}

const modalImgDisplay = (imgSrc, imgAlt) => {
  // Get the modal
  var modal = document.getElementById("myModal");
  
  // Get the image and insert it inside the modal - use its "alt" text as a caption
  var modalImg = document.getElementById("imgModal");
  var captionText = document.getElementById("caption");
  modal.style.display = "block";
  modalImg.src = imgSrc;
  captionText.innerHTML = imgAlt;

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() { 
    modal.style.display = "none";
  }
}

const Card = (props) => {
  return (
    <div style={{margin: "auto", maxWidth: props.maxWidth ? props.maxWidth : maxWidth}}>
      <div className={cardClasses(props.bgcolor, props.txtcolor)} style={{margin: "0.5em", maxWidth: props.maxWidth ? props.maxWidth : maxWidth}}>
        <div className={hdrClasses(props.headerbgcolor, props.headertxtcolor, props.bgcolor, props.txtcolor)}>{props.header}</div>
        <div className="card-body">
          {props.title && (<h5 className="card-title">{props.title}</h5>)}
          {props.text && (<p className="card-text">{props.text}</p>)}
          {props.body}
          {props.status && (<div className="text-danger warning">{props.status}</div>)}
        </div>
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
  
  const clearForm = (e) => {props.clearForm();}

  const validate = (field, label) => {
    setStatus('');
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
      if (show===null) {
        props.handle2();
      } else {
        rtn = props.handle(frmData);
      }
    }
  }

  React.useEffect(() => {
    let frm = document.getElementById("form")
    if (frm!==null && frm!==undefined) frm.reset();
    let tmpFrmInputs = [];
    let tmpFrmData = {};
    props.elems.map((elem) => {
      if (elem.elem === "input") {
        if (["text", "checkbox", "tel", "date", "password", "number", "hidden"].includes(elem.type)) {
          tmpFrmData[elem.name] = elem.value;
          tmpFrmInputs.push(elem.name);
        }
      } else {
        if (elem.elem!=="button" && elem.elem!=="label") {
          tmpFrmData[elem.name] = elem.value;
          tmpFrmInputs.push(elem.name);
        }
      }
      if (elem.elem === "button" && elem.type !== "submit") {
        tmpFrmInputs.push(elem.name);
      }
    });
    setFrmInputs(tmpFrmInputs);
    setFrmData(tmpFrmData);
  }, [props.elems]);  
  React.useEffect(() => {
    setShow(props.show);
    setStatus(props.status);
  }, [props.show, props.status]);

  return (
    <Card
      bgcolor="light"
      headerbgcolor="secondary"
      txtcolor="dark"
      header={props.header}
      status={status}
      body={show || show===null ? (
        <>
          {show === null ? 
            <h5 className="text-success">Success</h5>
          : <></>}
          <form id="form" onSubmit={(e) => {onSubmit(e)}}>
            {props.elems.map((elem, index) => (
              <div key={`${elem.name}_${index}`}>
                {elem.elem === "header" ? <h4>{elem.label}{elem.value}</h4> : <></>}
                {elem.elem === "input" && elem.type !== "hidden" ?
                  (<>
                    {elem.label && elem.type!=="checkbox" ? <>{elem.label}<br/></> : <></>}
                    {elem.type === "file"
                      ? <><input type={elem.type} id={elem.name} name={elem.name} multiple/><br/></>
                      : (elem.type==="checkbox" ? <><input type={elem.type} name={elem.name} id={elem.name} autoFocus={elem.focus ? true : false} defaultValue={elem.value} onChange={(e) => {onChange(e)}}/> <label htmlFor={elem.name}>{elem.label}</label><br/></>
                        : <><input type={elem.type} step={(elem.step ? elem.step : "any")} pattern={(elem.pattern ? elem.pattern : "[^]*")} className={`form-control ${elem.disabled ? "disabled" : ""}`} name={elem.name} placeholder={(elem.holder ? elem.holder : "")} defaultValue={elem.value} autoFocus={elem.focus ? true : false} onChange={(e) => {onChange(e)}}/></>)
                    }
                    {elem.type !== "hidden" && elem.type !== "file" ? 
                      (<>
                        {errors[`${elem.name}`] && (<div className="text-warning warning">{errors[`${elem.name}`]}</div>)}
                        <br/>
                      </>):(<></>)
                    }
                  </>):(<></>)
                }
                {elem.elem === "select" ?
                  (<>
                    {elem.label ? <>{elem.label}<br/></> : <></>}
                    <select className="form-select" id={elem.name} name={elem.name} defaultValue={elem.value} autoFocus={elem.focus ? true : false} onChange={(e) => {onChange(e)}}>
                      {elem.object === undefined ? elem.type
                      : elem.object.map((obj, index) => (
                        <option key={obj.id !== undefined ? obj.id : index} value={obj.value}>{obj.name}</option>
                      ))}
                    </select>
                    <br/>
                  </>) : (<></>)
                }
                {elem.elem === "label" ?
                  (<>
                    {elem.label ? <>{elem.label}<br/></> : <></>}
                    <p id={elem.name}>{elem.value}</p>
                    <br/>
                  </>):(<></>)
                }
                {elem.elem === "div" ?
                  (<div id={elem.name}>{elem.value}</div>):(<></>)
                }
              </div>
            ))}
            <br/>
            {show ?
              <button id="frmSubmit" type="submit" className="btn btn-secondary" disabled={submit}>{(props.submit ? props.submit : props.header)}</button>
            : <>
              <button id="frmClear" type="submit" className="btn btn-secondary">{props.success}</button>
            </>}
          </form>
        </>) : (
          <>
          <h5 className="text-success">Success</h5>
          <button id="frmClear" className="btn btn-secondary" onClick={(e) => {clearForm(e)}}>{props.success}</button>
          </>
        )
      }
    />
  )
}