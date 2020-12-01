import Header from "./header";

const SiteLayout = ({ children }) => {
  return (
    <div>
      <Header></Header>
      {children}
      {/* <Footer>Footer</Footer> */}
    </div>
  );
};

export default SiteLayout;
