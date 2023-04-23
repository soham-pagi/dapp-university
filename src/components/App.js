import React, { Component } from "react";
// import logo from "../logo.png";
import "./App.css";

import Navbar from "./Navbar";
import Main from "./Main";

// import Web3 from "web3";
import { ethers } from "ethers";

import Marketplace from "../abis/Marketplace.json";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        window.provider = new ethers.providers.Web3Provider(window.ethereum);
        // const accounts = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        // console.log({ accounts });
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    });
  }

  async loadBlockchainData() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    this.setState({ account: accounts[0] });

    const networkId = await window.ethereum.networkVersion;
    const networkData = Marketplace.networks[networkId];

    if (networkData) {
      const marketplace = new ethers.Contract(
        networkData.address,
        Marketplace.abi,
        window.provider
      );

      window.marketplace = marketplace;
      this.setState({ marketplace });
      this.setState({ loading: false });
    } else {
      window.alert(
        "Marketplace contract is not deployed to the detected network."
      );
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      productCount: 0,
      products: [],
      loading: true,
    };

    this.createProduct = this.createProduct.bind(this);
    this.productCount = this.productCount.bind(this);
    this.purchaseProduct = this.purchaseProduct.bind(this);
  }

  createProduct(name, price) {
    this.setState({ loading: true });

    // this.state.marketplace
    //   .createProduct(name, price)
    //   .send({ from: this.state.account })
    //   .once("receipt", (receipt) => {
    //     this.setState({ loading: false });
    //   });

    this.state.marketplace
      .connect(window.provider.getSigner())
      .createProduct(name, price)
      .then((transaction) => {
        transaction.wait().then((receipt) => {
          console.log(receipt);
          this.setState({ loading: false });
        });
      });
  }

  purchaseProduct(id = 1, price = 10) {
    // this.setState({ loading: true });
    window.marketplace
      .purchaseProduct(id)
      .then((tx) => {
        return tx.wait();
      })
      .then((receipt) => {
        // this.setState({ loading: false });
        // transaction successful, do something
        console.log("done tx");
      })
      .catch((error) => {
        console.error(error);
        // this.setState({ loading: false });
        // transaction failed, handle error
      });
  }

  async productCount() {
    const pc = await this.state.marketplace.productCount();
    const n = pc.toNumber();

    console.log(n);
    console.log(this.state.marketplace);
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <div onClick={this.productCount}>{"hello"}</div>
            <div onClick={this.purchaseProduct}>{"purchase"}</div>
            <main role="main" className="col-lf-12 d-flex">
              {this.state.loading ? (
                <h1>Loading...</h1>
              ) : (
                <Main createProduct={this.createProduct} />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
