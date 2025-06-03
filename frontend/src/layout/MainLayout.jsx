import React from "react";
import Header from "./Header";
import PageWrapper from "./PageWrapper";

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <PageWrapper>{children}</PageWrapper>
    </>
  );
};

export default MainLayout;