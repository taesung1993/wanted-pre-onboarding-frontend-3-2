import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import AuthService from '../utils/services/Auth.service';
import { useAppDispatch, useAppSelector } from '../utils/store';
import { setUser } from '../utils/store/userReducer';
import LocalService from '../utils/services/Local.service';
import { useEffect } from 'react';
import CookieService from '../utils/services/Cookie.service';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.user);
  const login = useMutation(AuthService.signIn, {
    onSuccess: (response) => {
      const {
        data: { user }
      } = response;

      LocalService.set('userId', user.id);
      dispatch(setUser(user));

      AuthService.autoSignOut(router);
      router.push('/');
    }
  });

  const onLogin = async () => {
    login.mutate();
  };

  useEffect(() => {
    if (state) {
      dispatch(setUser(null));
    }

    CookieService.remove('expiredDate');
    LocalService.remove('userId');
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <h1>로그인 페이지</h1>
        <button type='button' onClick={onLogin}>
          로그인 버튼
        </button>
      </main>
    </div>
  );
}