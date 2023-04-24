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
    await this.connectWallet();
  }

  async connectWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const wallet = provider.getSigner();

      const ethAddress = Marketplace.networks[5777].address;

      const marketplace = new ethers.Contract(
        ethAddress,
        Marketplace.abi,
        provider
      );

      const marketplaceWithSigner = marketplace.connect(wallet);

      this.setState({ marketplace, marketplaceWithSigner });

      window.marketplace = marketplace;
      window.marketplaceWithSigner = marketplaceWithSigner;

      // set loading false
      this.setState({ loading: false });
    } catch (err) {
      console.log(err);
    }

    this.listProducts();
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
    this.listProducts = this.listProducts.bind(this);
  }

  async productCount() {
    try {
      const count = (await this.state.marketplace.productCount()).toNumber();
      console.log(count);
    } catch (err) {
      console.log(err);
    }
  }

  async listProducts() {
    const count = (await this.state.marketplace.productCount()).toNumber();

    const t = [];

    try {
      for (let i = 1; i <= count; i++) {
        const product = await this.state.marketplace.products(i);
        t.push(product);
      }

      this.setState({ products: t });
    } catch (err) {
      console.log(err);
    }
  }

  createProduct(name, price) {
    this.setState({ loading: true });

    this.state.marketplaceWithSigner
      .createProduct(name, price)
      .then((transaction) => {
        transaction.wait().then((receipt) => {
          console.log(receipt);
          this.setState({ loading: false });
        });
      });

    this.setState({ loading: false });
  }

  purchaseProduct(id = 1) {
    console.log("clicked purchase");
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <div onClick={this.productCount}>Product Count</div>
            <button onClick={this.listProducts}>List all</button>
            <button onClick={this.purchaseProduct}>purchase</button>
            <main role="main" className="col-lf-12 d-flex">
              {this.state.loading ? (
                <h1>Loading...</h1>
              ) : (
                <Main
                  products={this.state.products}
                  createProduct={this.createProduct}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
