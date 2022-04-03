import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Wrapper,
  Form,
  Input,
  InputWrapper,
  Label,
  SubmitWrapper,
} from '../components/styles/Form';
import { Button, DangerButton } from '../components/styles/Button';
import { deleteUser, getUser, putUser } from '../api/users';
import { Loading } from '../components/styles/Loading';

type IFormInputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

const schema = yup.object({
  name: yup
    .string()
    .min(3, 'The name should be at least 3 characters.')
    .max(128, 'The name should not have more than 128 characters.'),
  email: yup.string().email('Email must be a valid email.'),
  password: yup
    .string()
    .notRequired()
    .matches(/.{8,}/, {
      excludeEmptyString: true,
      message: 'The password should be at least 8 characters.',
    })
    .max(128, 'The password should not have more than 128 characters.'),
  passwordConfirm: yup
    .string()
    .notRequired()
    .matches(/.{8,}/, {
      excludeEmptyString: true,
      message: 'The password should be at least 8 characters.',
    })
    .max(128, 'The password should not have more than 128 characters.')
    .oneOf([yup.ref('password'), null], 'Passwords must match.'),
});

const Profile: NextPage = function Profile() {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) => putUser(data);

  const getUserRequest = async () => {
    const res = await getUser();
    if (res) {
      reset({
        name: res.data.result.name,
        email: res.data.result.email,
        password: '',
        passwordConfirm: '',
      });
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    deleteUser().then(() => {
      localStorage.removeItem('x-auth-token');
      window.location.href = '/login';
    });
  };

  useEffect(() => {
    getUserRequest();
  }, []);

  return (
    <>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Wrapper>
          <h1>Profile</h1>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputWrapper>
              <Label>Username</Label>
              {errors.name ? (
                <Input error {...register('name')} />
              ) : (
                <Input {...register('name')} />
              )}
              <p>{errors.name?.message}</p>
            </InputWrapper>

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

            <InputWrapper>
              <Label>Confirm password</Label>
              {errors.passwordConfirm ? (
                <Input error {...register('passwordConfirm')} type="password" />
              ) : (
                <Input {...register('passwordConfirm')} type="password" />
              )}
              <p>{errors.passwordConfirm?.message}</p>
            </InputWrapper>

            <SubmitWrapper direction="row">
              <DangerButton onClick={() => handleDelete()}>
                Delete account
              </DangerButton>
              <Button type="submit">Register</Button>
            </SubmitWrapper>
          </Form>
        </Wrapper>
      )}
    </>
  );
};

export default Profile;
