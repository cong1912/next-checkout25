import Layout from "../components/Layout";

const success = () => {
  return (
    <Layout>
      <div className="py-5 text-center">
        <h2>Success</h2>
        <p className="lead">your purchase has been successfully</p>
      </div>
    </Layout>
  );
};

export default success;
