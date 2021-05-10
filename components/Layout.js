import Head from "next/head";
const Layout = (props) => {
  return (
    <div>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-wEmeIV1mKuiNpC+IOBjI7aAzPcEZeedi5yW5f2yOq55WWLwNGmvvx4Um1vskeMj0"
          crossorigin="anonymous"
        />
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <div className="container">{props.children}</div>
    </div>
  );
};

export default Layout;
