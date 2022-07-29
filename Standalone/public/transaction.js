const Transaction = (props) => {
  const {type, setData} = props;
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [user, setUser] = React.useState(null);
  const header = parseInt(type)===1 ? "Deposit" : "Withdraw";
  const elems = [
    {elem:"header", label:"Balance $", name:"current_balance", user:true, value:user!==null ? user.balance : ""},
    {elem:"input", type:"number", step:"0.01", label:(type===1 ? "Deposit" : "Withdraw") + " Amount", name:"transaction", holder:(type===1 ? "Deposit" : "Withdraw") + " Amount", value:"", focus:true},
    parseInt(type)===1 && (
      {elem:"input", type:"file", name:"file"}
    )
  ];
  const urlHeader = {headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("aToken")
  }}
  
  const loadData = () => {
    fetch(`/account/findAuth/`, urlHeader)
      .then(response => response.json())
      .then(data => {
        setUser(data);
    });
  }

  React.useEffect(() => {
    loadData();
  }, []);

  const clearForm = () => {
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
          fetch(`/account/update/image/${transId}`, urlHeader)
            .then(response => response.json())
            .then(data => {
              if (data.doc.modifiedCount === 1) {
                setShow(false);
              } else {
                setStatus("Error uploading photo");
              }
            })
            .catch(error => {
              setStatus("Error uploading photo");
            });
        })
        .catch(function(error) {
          setStatus("Error uploading photo");
        });
    } else {
      setShow(false);
    }
  }

  const handle = (data) => {
    setStatus('');
    if(user !== null && data !== null) {
      data.transaction = data.transaction.length === 0 ? 0 : parseFloat(data.transaction);
      let oldBalance = parseFloat(user.balance);
      let transaction = data.transaction * type;
      let newBalance = Math.round(((oldBalance + transaction) + Number.EPSILON) * 100) / 100;
      if (newBalance < 0) {
        setStatus("Transaction Failed: amount cannot exceed balance");
        return;
      }
      fetch(`/account/update/transaction/${transaction}/${newBalance}`, urlHeader)
        .then(response => response.json())
        .then(data => {
          let tmpStatus = '';
          if (data.doc.modifiedCount === 1) {
            if (data.newTransaction !== undefined && data.newTransaction.length > 0) {
              let tmpUser = {...user};
              let newTransaction = data.newTransaction[0];
              let transactions = Array.isArray(tmpUser.transactions) ? tmpUser.transactions : [];
              transactions.push(newTransaction);
              tmpUser.balance = newBalance;
              tmpUser.transactions = transactions;
              let encUser = btoa(JSON.stringify({name: decrypt(localStorage.getItem("uToken"), "name"), role: decrypt(localStorage.getItem("uToken"), "role"), balance: newBalance}));
              localStorage.setItem('uToken',encUser);
              setData({"user":user.role, "balance":newBalance});
              if (type===1) {
                checkImage(newTransaction.transId);
              } else {
                setShow(false);
              }
            }
            else {
              tmpStatus = 'Transaction failed';
            }
          } else {
            tmpStatus = 'Update failed';
          }
          setStatus(tmpStatus);
      });
      return;
    }
    setStatus("Error: user not found");
  }

  if (!(checkLogin(header))) {
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
      />
    )
  }
}
