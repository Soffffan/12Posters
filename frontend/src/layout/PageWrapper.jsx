import React from "react";

const PageWrapper = ({ children }) => {
  return (
    <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {children}
    </main>
  );
};

export default PageWrapper;
