import styles from "../staticPage.module.css";

export const metadata = {
  title: "Contact | Sudhanshu Blog",
};

const ContactPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contact</h1>
      <div className={styles.content}>
        <h2 className={styles.heading}>Get in touch</h2>
        <p>Have a question, feedback or a collaboration idea? Write to us.</p>
        <p>
          Email:{" "}
          <a href="mailto:your-email@example.com">your-email@example.com</a>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
