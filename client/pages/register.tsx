import React, { ReactElement, useEffect } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';

import { registerUser } from '../api/users';
import { Button } from '../components/styles/Button';
import {
  Form,
  Wrapper,
  Input,
  InputWrapper,
  Label,
  SubmitWrapper,
} from '../components/styles/Form';

type IFormInputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type RegisterType = NextPage & { getLayout: any };

const schema = yup
  .object({
    name: yup
      .string()
      .required('The name is a required field.')
      .min(3, 'The name should be at least 3 characters.')
      .max(128, 'The name should not have more than 128 characters.'),
    email: yup
      .string()
      .required('The email is a required field.')
      .email('Email must be a valid email.'),
    password: yup
      .string()
      .required('The password is a required field.')
      .min(8, 'The password should be at least 8 characters.')
      .max(128, 'The password should not have more than 128 characters.'),
    passwordConfirm: yup
      .string()
      .required('The password is a required field.')
      .min(8, 'The password should be at least 8 characters.')
      .max(128, 'The password should not have more than 128 characters.')
      .oneOf([yup.ref('password'), null], 'Passwords must match.'),
  })
  .required();

const Register: RegisterType = function Register() {
  useEffect(() => {
    if (localStorage.getItem('x-auth-token')) {
      window.location.href = '/';
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) =>
    registerUser(data).then((res) => {
      if (res === 'Invalid email or password') {
        setError('email', {
          message: res,
        });
      }
    });

  return (
    <Wrapper>
      <h1>Register</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <Label>Username</Label>
          <Input error={!!errors.name} {...register('name')} />
          <p>{errors.name?.message}</p>
        </InputWrapper>

        <InputWrapper>
          <Label>Email Adress</Label>
          <Input error={!!errors.email} {...register('email')} />
          <p>{errors.email?.message}</p>
        </InputWrapper>

        <InputWrapper>
          <Label>Password</Label>
          <Input
            error={!!errors.password}
            {...register('password')}
            type="password"
          />
          <p>{errors.password?.message}</p>
        </InputWrapper>

        <InputWrapper>
          <Label>Confirm password</Label>
          <Input
            error={!!errors.passwordConfirm}
            {...register('passwordConfirm')}
            type="password"
          />
          <p>{errors.passwordConfirm?.message}</p>
        </InputWrapper>

        <SubmitWrapper direction="column">
          <Button type="submit">Register</Button>
          <Link passHref href="/login">
            <p>I already have an account</p>
          </Link>
        </SubmitWrapper>
      </Form>
    </Wrapper>
  );
};

// custom layout without header/footer
Register.getLayout = function PageLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Register;
