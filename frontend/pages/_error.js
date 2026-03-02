export default function ErrorPage({ statusCode }) {
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      {statusCode ? `An error ${statusCode} occurred.` : "An unexpected error occurred."}
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return { statusCode };
};
