import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";

const getLatestPost = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/posts?page=1&limit=1", {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const { posts } = await res.json();
    return posts?.[0] || null;
  } catch (err) {
    return null;
  }
};

const Featured = async () => {
  const post = await getLatestPost();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey, Sudhanshu here!</b> Discover my stories and creative ideas.
      </h1>
      {post && (
        <div className={styles.post}>
          <div className={styles.imgContainer}>
            <Image
              src={post.img || "/p1.jpeg"}
              alt=""
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.textContainer}>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.postDesc}>
              {post.desc
                ?.replace(/<[^>]+>/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .substring(0, 260)}
              ...
            </p>
            <Link href={`/posts/${post.slug}`} className={styles.button}>
              Read More
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured;
