const NavBar = () => {
  return(
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">BadBank</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a id="createAccount" className="nav-link" href="#/createAccount/">Create Account</a>
          </li>
          <li className="nav-item">
            <a id="login" className="nav-link" href="#/login/">Login</a>
          </li>
          <li className="nav-item">
            <a id="deposit" className="nav-link" href="#/deposit/">Deposit</a>
          </li>
          <li className="nav-item">
            <a id="withdraw" className="nav-link" href="#/withdraw/">Withdraw</a>
          </li>
          <li className="nav-item">
            <a id="balance" className="nav-link" href="#/balance/">Balance</a>
          </li>
          <li className="nav-item">
            <a id="allData" className="nav-link" href="#/allData/">AllData</a>
          </li>          
        </ul>
      </div>
    </nav>
    </>
  );
}