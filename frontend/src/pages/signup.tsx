import React from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import SignupForm from '@/components/user/SignupForm';

const SignupPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up | Archway Interior Design</title>
        <meta name="description" content="Create an account with Archway Interior Design to save your favorite projects and more." />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <SignupForm />
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

export default SignupPage; 