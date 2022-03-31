import React, { ReactElement, useEffect } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { loginUser } from '../api/users';
import { Button } from '../components/styles/Button';
import Link from 'next/link';
import {
  Form,
  Wrapper,
  Input,
  InputWrapper,
  Label,
  SubmitWrapper,
} from '../components/styles/Form';

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

  // TODO: retrieve email not found error, probably with notifications
  return (
    <Wrapper>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <Label>Email Adress</Label>
          {errors.email ? (
            <Input error {...register('email')} />
          ) : (
            <Input {...register('email')} />
          )}
          <p>{errors.email?.message}</p>
        </InputWrapper>

        <InputWrapper>
          <Label>Password</Label>
          {errors.password ? (
            <Input error {...register('password')} type="password" />
          ) : (
            <Input {...register('password')} type="password" />
          )}
          <p>{errors.password?.message}</p>
        </InputWrapper>

        <SubmitWrapper>
          <Button type="submit">Submit</Button>
          <Link passHref href="/register">
            <p>Create an account</p>
          </Link>
        </SubmitWrapper>
      </Form>
    </Wrapper>
  );
};

Login.getLayout = function PageLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Login;
