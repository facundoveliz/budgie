import React, { ReactElement, useEffect } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { loginUser } from '../api/users';
import { Button } from '../components/styles/Button';
import * as F from '../components/styles/Form';
import Link from 'next/link';

interface IFormInputs {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .required('The email is a required field.')
      .email('Email must be a valid email.'),
    password: yup
      .string()
      .required('The password is a required field.')
      .min(8, 'The password should be at least 8 characters.')
      .max(128, 'The password should not have more than 128 characters.'),
  })
  .required();

type LoginType = NextPage & { getLayout: any };

const Login: LoginType = function Login() {
  useEffect(() => {
    if (localStorage.getItem('x-auth-token')) {
      window.location.href = '/';
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) => loginUser(data);

  // TODO: retrieve email not found error, in register component too
  return (
    <F.Wrapper>
      <h1>Login</h1>
      <F.Form onSubmit={handleSubmit(onSubmit)}>
        <F.InputWrapper>
          <F.Label>Email Adress</F.Label>
          {errors.email ? (
            <F.Input error {...register('email')} />
          ) : (
            <F.Input {...register('email')} />
          )}
          <p>{errors.email?.message}</p>
        </F.InputWrapper>

        <F.InputWrapper>
          <F.Label>Password</F.Label>
          {errors.password ? (
            <F.Input error {...register('password')} type="password" />
          ) : (
            <F.Input {...register('password')} type="password" />
          )}
          <p>{errors.password?.message}</p>
        </F.InputWrapper>

        <F.SubmitWrapper>
          <Button type="submit">Submit</Button>
          <Link passHref href="/register">
            <p>I already have an account</p>
          </Link>
        </F.SubmitWrapper>
      </F.Form>
    </F.Wrapper>
  );
};

Login.getLayout = function PageLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Login;
