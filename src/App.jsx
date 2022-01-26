import React, { useState } from "react";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import { ethers } from "ethers";
const smartContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {
  const [greeting, setGreeting] = useState("");
  const [data, setData] = useState("");

  const requestAccount = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        smartContractAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setData(data);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("err");
    }
  };

  const submitGreeting = async (e) => {
    e.preventDefault();
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        smartContractAddress,
        Greeter.abi,
        signer
      );
      const trasaction = await contract.setGreeting(greeting);
      await trasaction.wait();
      setGreeting("");
      fetchGreeting();
    }
  };

  return (
    <div className="container">
      <h1> {data}</h1>
      <button onClick={fetchGreeting}>Fetch Greeting</button>
      <form onSubmit={submitGreeting}>
        <input
          placeholder="Enter your greeting"
          onChange={(e) => setGreeting(e.target.value)}
          value={greeting}
          required
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
