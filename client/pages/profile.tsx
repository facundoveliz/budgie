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
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) =>
    putUser(data).then((res) => {
      if (res === 'Invalid email or password') {
        setError('email', {
          message: 'Email already in use',
        });
      }
    });

  const getUserRequest = async () => {
    setLoading(true);
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
              <DangerButton onClick={() => handleDelete()}>
                Delete account
              </DangerButton>
              <Button type="submit">Accept</Button>
            </SubmitWrapper>
          </Form>
        </Wrapper>
      )}
    </>
  );
};

export default Profile;
