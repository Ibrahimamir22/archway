import React from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import LoginForm from '@/components/user/LoginForm';

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Log In | Archway Interior Design</title>
        <meta name="description" content="Log in to your Archway Interior Design account to access your saved projects and more." />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <LoginForm />
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default LoginPage; 