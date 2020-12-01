import useUser from "../hooks/use-user";
import styles from "./header.module.css";
import utilStyles from "../styles/util.module.css";
import Container from "./container";
import Button from "./button";

const Header = () => {
  const { user, logout, login, error } = useUser();

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.container}>
          <span className={styles.logo}></span>
          <div>
            {user ? (
              <>
                <span> Hello {user.email}</span>
                <Button
                  className="u-margin-left-small"
                  onClick={() => logout()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Button className="u-margin-left-small" onClick={() => login()}>
                Log in
              </Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
