const CreateAccount = () => {
  const ctx = React.useContext(UserContext);

  const handle = (data) => {
    ctx.push(data);
    return true;
  }

  return (
    <Form
      header="CreateAccount"
      handle={handle}
    />
  )
}