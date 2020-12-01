import styles from "./button.module.css";

const Button = (props) => {
  return (
    <button
      {...props}
      className={`${props.className} ${styles.button}`}
    ></button>
  );
};

export default Button;
