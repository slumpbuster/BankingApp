const Home = () => {
  return (
    <Info
      header="BadBank MERN Application"
      title="Welcome to the bank"
      text="You can move around using the navigation bar."
      body={(<img src="bank.png" className="img-fluid" alt="Bank"/>)}
    />
  );
}