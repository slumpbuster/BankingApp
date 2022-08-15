const Transaction = (props) => {
  const ctx = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const {type, setData} = props;
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [user, setUser] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const header = parseInt(type)===1 ? "Deposit" : parseInt(type)===-1 ? "Withdraw" : "Transfer";
  const [elems, setElems] = React.useState([]);
  const [frmData, setFrmData] = React.useState({});
  const urlHeader = {headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("aToken")
  }}
  
  const loadData = () => {
    fetch(`/account/findAuth/`, {method: 'GET', headers: urlHeader.headers})
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        if (!invalid(data)) {
          data.balance = data.balance.length === 0 ? 0 : parseFloat(data.balance);
          setUser(data);
          data.accounts.map(account => {
            account.balance = account.balance.length === 0 ? 0 : parseFloat(account.balance);
          });
          let tmpAccount = data.accounts.filter(account => account.actId === ((ctx!==null && ctx.account!==undefined) ? ctx.account : ""));
          if (tmpAccount.length > 0) tmpAccount = tmpAccount[0];
          setAccount(tmpAccount);
          let tmpElems = [
            {elem:"input", type:"number", step:"0.01", label:header + " Amount", name:"transaction", holder:header + " Amount", value:"", focus:true}
          ];
          switch (parseInt(type)) {
            case -1:
              tmpElems.unshift({elem:"header", label:"Balance $", name:"current_balance", user:true, value:tmpAccount!==null ? tmpAccount.balance : ""});
              break;
            case 1:
              tmpElems.unshift({elem:"header", label:"Balance $", name:"current_balance", user:true, value:tmpAccount!==null ? tmpAccount.balance : ""});
              tmpElems.push({elem:"input", type:"file", name:"file"});
              break;
            case 0:
              let transfer = [];
              data.accounts.map(account => {
                transfer.push({id: account.actId, name: `${account.type} ($${account.balance})`, value: account.actId});
              });
              data.accounts.map((account, index) => {
                if (index===0) {
                  tmpElems.push({elem:"select", object:transfer, label:"From", name:"from", value:account.actId});
                } else {
                  tmpElems.push({elem:"select", object:transfer, label:"To", name:"to", value:account.actId});
                }
              });
              break;
            default:
          }
          setElems(tmpElems);
        } else {
          setError(true);
        }
      })
      .catch(error => {
        setLoading(false);
        setError(true);
      });
  }
  React.useEffect(() => {
    loadData();
  }, [ctx]);

  const clearForm = () => {
    setFrmData({});
    setShow(true);
    loadData();
  }
  
  const checkImage = (transId) => {
    const upload = document.getElementById('upload');
    const file = document.getElementById('file');
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const ref = storageRef.child(transId);
    if (file!==null && file.files.length>0) {
      const photo = file.files[0];
      ref.put(photo)
        .then(function(snapshot) {
          fetch(`/account/update/image/${transId}`, {method: 'PUT', headers: urlHeader.headers})
            .then(response => response.json())
            .then(data => {
              setFrmData({});
              setShow(false);
            })
            .catch(error => {
              setStatus("Error uploading photo");
              return;
            });
        })
        .catch(function(error) {
          setStatus("Error uploading photo");
          return;
        });
    } else {
      setShow(false);
    }
  }

  const handle = (data) => {
    setStatus('');
    if(user !== null && data !== null) {
      let transaction = data.transaction.length === 0 ? 0 : parseFloat(data.transaction);
      let newTotalBalance = parseFloat(user.balance);
      if (type===0) {
        if (data.from === data.to) {
          setStatus("Error: can't transfer to the same account");
          return;
        } else {
          let tmpFromAccount = user.accounts.filter(account => account.actId === data.from)[0];
          let newFromBalance = Math.round(((parseFloat(tmpFromAccount.balance) + -Math.abs(transaction)) + Number.EPSILON) * 100) / 100;
          let tmpToAccount = user.accounts.filter(account => account.actId === data.to)[0];
          let newToBalance = Math.round(((parseFloat(tmpToAccount.balance) + transaction) + Number.EPSILON) * 100) / 100;
          if (newFromBalance < 0) {
            setStatus("Transaction Failed: amount cannot exceed balance");
            return;
          } else {
            fetch(`/account/transfer/${data.from}/${data.to}/${transaction}/${newFromBalance}/${newToBalance}/${newTotalBalance}`, {method: 'POST', headers: urlHeader.headers})
              .then(response => response.json())
              .then(respData => {
                setUser(respData);
                setData(createUToken(respData, account.actId));
                setShow(false);
              })
              .catch(error => {
                setStatus("Error transferring funds");
                return;
              });
          }
        }
      } else {
        let oldBalance = parseFloat(account.balance);
        transaction = type===-1 ? -Math.abs(parseFloat(transaction)) : parseFloat(transaction);
        let newActBalance = Math.round(((oldBalance + transaction) + Number.EPSILON) * 100) / 100;
        newTotalBalance = Math.round(((newTotalBalance + transaction) + Number.EPSILON) * 100) / 100;
        if (newActBalance < 0) {
          setStatus("Transaction Failed: amount cannot exceed balance");
          return;
        }
        fetch(`/account/transaction/${type===1 ? "Deposit" : type===-1 ? "Withdraw" : "Unknown"}/${transaction}/${newActBalance}/${newTotalBalance}`, {method: 'POST', headers: urlHeader.headers})
          .then(response => response.json())
          .then(respData => {
            setUser(respData);
            setData(createUToken(respData, account.actId));
            if (type===1) {
              let newTransaction = respData.accounts.filter(act => act.actId === account.actId)[0].transactions;
              checkImage(newTransaction[newTransaction.length-1].transId);
            } else {
              setFrmData({});
              setShow(false);
            }
          })
          .catch(error => {
            setStatus("Transaction failed");
            return;
          });
      }
      return;
    }
    setStatus("Error: user not found");
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
  } else if (!(checkLogin(header))) {
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
        success={`Add another ${header.toLowerCase()}`}
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
