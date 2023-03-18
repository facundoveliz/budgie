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
import { Fetching, Loading } from '../components/styles/Loading';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
  email: yup
    .string()
    .min(1, 'The email is a required field')
    .email('Email must be a valid email.')
    .required(),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const getUserRequest = async () => {
    const { data } = await getUser();
    reset({
      name: data.result.name,
      email: data.result.email,
      password: '',
      passwordConfirm: '',
    });
  };

  const queryClient = useQueryClient();

  const userQuery = useQuery('user', getUserRequest);
  const deleteUserMutation = useMutation(deleteUser);
  const putUserMutation = useMutation(putUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('user');
    },
    onError: (res) => {
      if (res.data.msg === 'Invalid email or password') {
        setError('email', {
          message: 'Email already in use',
        });
      }
    },
  });

  const onSubmit = (data: IFormInputs) => {
    putUserMutation.mutate(data);
  };

  const handleDelete = async () => {
    deleteUserMutation.mutate();
    localStorage.removeItem('x-auth-token');
    window.location.href = '/login';
  };

  if (userQuery.isError) {
    return <Fetching>An error has ocurred!</Fetching>;
  }

  return (
    <Wrapper>
      <h1>Profile</h1>
      {userQuery.isLoading ? (
        <Fetching>Loading...</Fetching>
      ) : userQuery.isError ? (
        <Fetching>Loading...</Fetching>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputWrapper>
            <Label>Username</Label>
            <Input error={!!errors.password} {...register('name')} />
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

          <SubmitWrapper direction="row">
            <Button
              type="submit"
              disabled={
                putUserMutation.isLoading || deleteUserMutation.isLoading
              }
            >
              Accept
            </Button>
            <DangerButton
              onClick={() => handleDelete()}
              disabled={
                putUserMutation.isLoading || deleteUserMutation.isLoading
              }
            >
              Delete account
            </DangerButton>
          </SubmitWrapper>
        </Form>
      )}
    </Wrapper>
  );
};

export default Profile;
