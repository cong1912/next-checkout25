import Head from "next/head";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import constants from "../constants";
import Stripe from "stripe";
export default function Home() {
  const router = useRouter();
  const { code } = router.query;
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  useEffect(() => {
    if (code != undefined) {
      (async () => {
        const { data } = await axios.get(`${constants.endpoint}/links/${code}`);
        setUser(data.user);
        setProducts(data.products);
        setQuantities(
          data.products.map((p) => ({
            product_id: p.id,
            quantity: 0,
          }))
        );
      })();
    }
  }, [code]);
  const change = (id, quantity) => {
    setQuantities(
      quantities.map((q) => {
        if (q.product_id == id) {
          return {
            ...q,
            quantity,
          };
        }
        return q;
      })
    );
  };
  const total = () => {
    return quantities.reduce((s, q) => {
      const product = products.find((p) => p.id === q.product_id);
      return s + product.price * q.quantity;
    }, 0);
  };

  const submits = async (e) => {
    e.preventDefault();
    await axios
      .post(`${constants.endpoint}/orders`, {
        first_name,
        last_name,
        email,
        address,
        country,
        city,
        zip,
        code,
        products: quantities,
      })
      .then(function (response) {
        console.log(response.data.id);
        const stripe = window.Stripe(constants.stripe_key);
        stripe.redirectToCheckout({
          sessionId: response.data.id,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <Layout>
      <div className="py-5 text-center">
        <h2>Welcome</h2>
        <p className="lead">
          {user?.first_name}
          {user?.last_name} has inviter you to buy these products
        </p>
      </div>
      <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
          <h4 className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Your cart</span>
            <span className="badge badge-secondary badge-pill">3</span>
          </h4>
          <ul className="list-group mb-3">
            {products.map((product) => {
              return (
                <div key={product.id}>
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                      <h6 className="my-0">{product.title}</h6>
                      <small className="text-muted">
                        {product.description}
                      </small>
                    </div>
                    <span className="text-muted">{product.price}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div>
                      <h6 className="my-0">Quantity</h6>
                    </div>
                    <input
                      type="number"
                      min="0"
                      style={{ width: "65px" }}
                      className="text-muted"
                      defaultValue={0}
                      onChange={(e) =>
                        change(product.id, parseInt(e.target.value))
                      }
                    />
                  </li>
                </div>
              );
            })}

            <li className="list-group-item d-flex justify-content-between">
              <span>Total (USD)</span>
              <strong>${total()}</strong>
            </li>
          </ul>
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Billing address</h4>
          <form className="needs-validation">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label for="firstName">First name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder=""
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <div className="invalid-feedback">
                  Valid first name is required/.
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label for="lastName">Last name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder=""
                  required
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
                <div className="invalid-feedback">
                  Valid last name is required/.
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label for="email">
                Email <span className="text-muted">(Optional)</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="you@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <div className="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>

            <div className="mb-3">
              <label for="address">Address</label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="1234 Main St"
                required
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
              <div className="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>

            <div className="row">
              <div className="col-md-5 mb-3">
                <label for="country">Country</label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  placeholder="Country"
                  required
                  onChange={(e) => {
                    setCountry(e.target.value);
                  }}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label for="City">City</label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  placeholder="City"
                  required
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label for="zip">Zip</label>
                <input
                  type="text"
                  className="form-control"
                  id="zip"
                  placeholder=""
                  onChange={(e) => {
                    setZip(e.target.value);
                  }}
                />
                <div className="invalid-feedback">Zip code required/.</div>
              </div>
            </div>

            <hr className="mb-4" />
            <button
              className="btn btn-primary btn-lg btn-block"
              onClick={submits}
            >
              checkout
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
