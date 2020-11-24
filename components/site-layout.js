import useUser from "../hooks/use-user";

const SiteLayout = ({ children }) => {
  const { user, logout, login, error } = useUser();

  return (
    <div>
      {user ? (
        <>
          <span> Hello {user.email}</span>
          <button onClick={() => logout()}>Log me out of firebase</button>
        </>
      ) : (
        <button onClick={() => login()}>Log in</button>
      )}
      {children}

      <footer>Footer fdsafd s</footer>
    </div>
  );
};

export default SiteLayout;
