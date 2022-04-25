const Deposit = () => {
  const ctx = React.useContext(UserContext);
  //const ctxUser = ctx.filter(user => user.loggedIn === true)[0];

  const handle = (data) => {
    for (let i=0; i< ctx.length; i++) {
      if (ctx[i].email === data.email) {
        ctx[i].balance += data.transaction;
        return true;
        break
      }
    }
    return "user not found";
  }

  return (
    <Form
      header="Deposit"
      handle={handle}
      users={ctx}
    />
  )
}
