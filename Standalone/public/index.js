const Spa = () => {
  const [data, setData] = React.useState(null);

  return (
    <HashRouter>
    {
      <React.Fragment>
        <NavBar data={data} />
          <div className="container" style={{padding: "20px"}}>
            <Route path="/" exact component={Home} />
            <Route path="/createAccount/" component={CreateAccount} />
            <Route path="/login/" render={(props) => <Login setData={setData} />} />
            <Route path="/deposit/" render={(props) => <Transaction type={1} setData={setData} />} />
            <Route path="/withdraw/" render={(props) => <Transaction type={-1} setData={setData} />} />
            <Route path="/transaction/" component={AllData} />
            <Route path="/allData/" component={AllData} />
          </div>
        </React.Fragment>
      }
    </HashRouter>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Spa/>);