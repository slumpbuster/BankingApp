const Home = () => {
  return (
    <Card
      headerbgcolor="dark"
      headertxtcolor="white"
      txtcolor="black"
      header="BadBank Landing Module"
      title="Welcome to the bank"
      text="You can move around using the navigation bar."
      body={(<img src="bank.png" className="img-fluid" alt="Responsive image"/>)}
    />
  );
}