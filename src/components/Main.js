import React from "react";

import { ethers } from "ethers";

class Main extends React.Component {
  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = this.productName.value;
            const price = ethers.utils.parseEther(
              this.productPrice.value.toString()
            );
            this.props.createProduct(name, price);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => {
                this.productName = input;
              }}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => {
                this.productPrice = input;
              }}
              className="form-control"
              placeholder="Product Price"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products.map((product, key) => (
              <tr key={key}>
                <th scope="row">1</th>
                <td>{product.name}</td>
                <td>{ethers.utils.formatEther(product.price) + " ETH"}</td>
                <td>{product.owner}</td>
                <td>
                  <button className="buyButton">Buy</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
