import React from "react";
import { Info } from './context';

const Home = () => {
  return (
    <Info
      header="BadBank Landing Module"
      title="Welcome to the bank"
      text="You can move around using the navigation bar."
      body={(<img src="./bank.png" className="img-fluid" alt="Bank"/>)}
    />
  );
}

export default Home;