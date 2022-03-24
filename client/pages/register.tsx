import React from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { registerUser } from '../api/users';

interface IFormInputs {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const schema = yup.object({
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


}).required();

const Register: NextPage = function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) => registerUser(data);

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name')} />
        <p>{errors.name?.message}</p>

        <input {...register('email')} />
        <p>{errors.email?.message}</p>

        <input {...register('password')} />
        <p>{errors.password?.message}</p>

        <input {...register('passwordConfirm')} />
        <p>{errors.passwordConfirm?.message}</p>

        <button type="submit">Submit</button>
       </form>
    </>
  );
};

export default Register;
