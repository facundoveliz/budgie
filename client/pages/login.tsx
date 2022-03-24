import React from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { loginUser } from '../api/users';

interface IFormInputs {
  email: string
  password: string
}

const schema = yup.object({
  email: yup
    .string()
    .required('The email is a required field.')
    .email('Email must be a valid email.'),
  password: yup
    .string()
    .required('The password is a required field.')
    .min(8, 'The password should be at least 8 characters.')
    .max(128, 'The password should not have more than 128 characters.'),

}).required();

const Login: NextPage = function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) => loginUser(data);

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} />
        <p>{errors.email?.message}</p>

        <input {...register('password')} />
        <p>{errors.password?.message}</p>

        <button type="submit">Submit</button>
       </form>
    </>
  );
};

export default Login;
