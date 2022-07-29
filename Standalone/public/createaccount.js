const CreateAccount = () => {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const elems = [
    {elem:"input", type:"input", label:"Name", name:"name", holder:"Enter name", value:"", focus:true},
    {elem:"input", type:"input", label:"Email address", name:"email", holder:"Enter email", value:""},
    {elem:"input", type:"password", label:"Password", name:"password", holder:"Enter password", value:""},
    {elem:"input", type:"hidden", name:"balance", value:"0"}
  ]

  const clearForm = () => {
    setShow(true);
  }

  const handle = (data) => {
    setStatus('');
    fetch(`/account/findOne/${data.email}`)
      .then(response => response.json())
      .then(user => {
        setStatus("Error: email already exists");
    })
    .catch(error => {
      data.balance = data.balance.length === 0 ? 0 : parseFloat(data.balance);
      data.transactions=[];

      const auth = firebase.auth();
      auth.createUserWithEmailAndPassword(data.email, data.password)
        .then(user => {
          const url = `/account/create/${user.user.uid}/${data.name}/${data.email}/${data.password}`;
          (async () => {
            let response = await fetch(url);
            let dataRtn = await response.json();
            setStatus('');
            setShow(false);
          })();
        })
        .catch(error => {
          setStatus(error.message);
        });
    })
  }

  return (
    <Form
      header="Create Account"
      success="Add another account"
      handle={handle}
      clearForm={clearForm}
      show={show}
      status={status}
      elems={elems}
    />
  )
}