const Spa = () => {
  const [data, setData] = React.useState(null);

  return (
    <HashRouter>
    {
      <React.Fragment>
        <UserContext.Provider value={data}>
          <NavBar setData={setData} />
            <div className="container" style={{padding: "20px"}}>
              <Route path="/" exact component={Home} />
              <Route path="/createAccount/" render={(props) => <CreateAccount create={true} />} />
              <Route path="/editAccount/" render={(props) => <CreateAccount create={false} />} />
              <Route path="/login/" render={(props) => <Login setData={setData} />} />
              <Route path="/deposit/" render={(props) => <Transaction type={1} setData={setData} />} />
              <Route path="/withdraw/" render={(props) => <Transaction type={-1} setData={setData} />} />
              <Route path="/transfer/" render={(props) => <Transaction type={0} setData={setData} />} />
              <Route path="/transaction/" component={AllData} />
              <Route path="/allData/" component={AllData} />
            </div>
        </UserContext.Provider>
        </React.Fragment>
      }
    </HashRouter>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Spa/>);