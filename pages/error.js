import Layout from "../components/Layout";

const error = () => {
  return (
    <Layout>
      <div className="py-5 text-center">
        <h2>Error</h2>
        <p className="lead">Couldn't process payment</p>
      </div>
    </Layout>
  );
};

export default error;
