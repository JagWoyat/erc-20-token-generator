import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";
import Token from "../artifacts/contracts/Contract.sol/CustomToken.json";

const App = () => {
  const [amount, setAmount] = useState();
  const [userAccountId, setUserAccountId] = useState();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  const [contractAddress, setContractAddress] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };
  const handleTotalSupplyChange = (event) => {
    setTotalSupply(event.target.value);
  };

  const deployTokenContract = async (event) => {
    event.preventDefault();
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const factory = new ethers.ContractFactory(
      Token.abi,
      Token.bytecode,
      signer
    );
    const contract = await factory.deploy(
      name,
      symbol,
      ethers.utils.parseEther(totalSupply)
    );

    await contract.deployed();
    setContractAddress(contract.address);

    setName("");
    setSymbol("");
    setTotalSupply("");

    console.log("Token contract deployed at:", contract.address);
  };

  const getTokenData = async (event) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Token.abi, signer);
    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    const tokenData = { tokenName, tokenSymbol };
    console.log(tokenData);
  };
  const sendToken = async (event) => {
    event.preventDefault();
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Token.abi, signer);
    const transaction = await contract.transfer(userAccountId, amount);
    await transaction.wait();
    console.log(`${amount} token has been sent to ${userAccountId}`);
  };

  return (
    <div>
      <h2>Token Deployment(Sepolia)</h2>
      <form onSubmit={deployTokenContract}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div>
          <label>Symbol:</label>
          <input
            type="text"
            value={symbol}
            onChange={handleSymbolChange}
            required
          />
        </div>
        <div>
          <label>Total Supply:</label>
          <input
            type="number"
            value={totalSupply}
            onChange={handleTotalSupplyChange}
            required
          />
        </div>
        <button type="submit">Deploy Token</button>
      </form>
      <button onClick={getTokenData}>Get token data</button>
      <h2>Send Token</h2>
      <form onSubmit={sendToken}>
        <input
          onChange={(e) => setUserAccountId(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button type="submit">Send Tokens</button>
      </form>
    </div>
  );
};

export default App;
