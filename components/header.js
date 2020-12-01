import useUser from "../hooks/use-user";
import styles from "./header.module.css";
import Container from "./container";
import Link from "next/link";

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
                <Link href="/submit/">
                  <a className="btn">Submit a learning</a>
                </Link>
                <button
                  className="btn u-margin-left-small"
                  onClick={() => logout()}
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                className="btn u-margin-left-small"
                onClick={() => login()}
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
