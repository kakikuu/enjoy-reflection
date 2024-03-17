import Head from "next/head";
import styles from "../styles/Home.module.css";
import { createClient } from "@supabase/supabase-js";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { config } from "dotenv";

config();
export default function Google() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Google認証画面</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.grid}>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google"]}
            />
          </div>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </>
  );
}
