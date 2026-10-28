import styles from "../staticPage.module.css";

export const metadata = {
  title: "About | Sudhanshu Blog",
};

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About</h1>
      <div className={styles.content}>
        <h2 className={styles.heading}>Welcome to Sudhanshu Blog</h2>
        <p>
          This is a place to read and share stories about style, fashion,
          food, travel, culture and coding.
        </p>
        <p>
          Sign in, write your own posts, and join the conversation in the
          comments.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
