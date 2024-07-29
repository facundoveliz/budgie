import React, { useRef } from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, InputWrapper, Label, Select } from '../styles/Form';
import { Button } from '../styles/Button';
import { postEntries } from '../../api/entries';
import {
  Background,
  CloseModalButton,
  ModalButtons,
  ModalContent,
  ModalWrapper,
} from './styles';
import { useMutation, useQueryClient } from 'react-query';

type IFormInputs = {
  category: string;
  type: boolean;
  amount: number;
};

type ModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  getEntryRequest: () => Promise<void>;
  getUserRequest: () => Promise<void>;
  type: boolean;
};

const schema = yup
  .object({
    category: yup
      .string()
      .required('The category is a required field.')
      .oneOf([
        'Food & Drinks',
        'Shopping',
        'Groceries',
        'Transport',
        'Health',
        'Life & Entertainment',
        'Salary',
        'Home',
        'Gift',
        'Savings',
        'Other',
      ]),
    amount: yup.number().required('The amount is a required field.'),
  })
  .required();

const Modal: NextPage<ModalProps> = function Modal({
  showModal,
  setShowModal,
  type,
}: ModalProps) {
  const modalRef = useRef<any>();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();

  const postEntriesMutation = useMutation(postEntries, {
    onSuccess: () => {
      queryClient.invalidateQueries('entries');
      queryClient.invalidateQueries('user');
      setShowModal(false);
      resetField('amount');
      resetField('category');
    },
  });

  const onSubmit = (data: IFormInputs) => {
    data.type = type;
    postEntriesMutation.mutate(data);
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  return (
		<>
			{showModal ? (
				<Background onClick={closeModal} ref={modalRef}>
					<ModalWrapper>
						<CloseModalButton
							aria-label="Close modal"
							onClick={() => setShowModal((prev) => !prev)}
						/>
						<ModalContent>
							<h1>New entry</h1>
							<Form onSubmit={handleSubmit(onSubmit)}>
								<InputWrapper>
									<Label>Category</Label>
									{type ? (
										<Select {...register('category')}>
											<option value="Other">Other</option>
											<option value="Savings">Savings</option>
											<option value="Salary">Salary</option>
											<option value="Gift">Gift</option>
										</Select>
									) : (
										<Select {...register('category')}>
											<option value="Other">Other</option>
											<option value="Food & Drinks">Food & Drinks</option>
											<option value="Groceries">Groceries</option>
											<option value="Transport">Transport</option>
											<option value="Health">Health</option>
											<option value="Life & Entertainment">
												Life & Entertainment
											</option>
											<option value="Home">Home</option>
											<option value="Gift">Gift</option>
											<option value="Savings">Savings</option>
										</Select>
									)}
									<p>{errors.category?.message}</p>
								</InputWrapper>

								<InputWrapper>
									<Label>Amount</Label>
									<Input {...register('amount')} type="number" min="0" />
									<p>{errors.amount?.message}</p>
								</InputWrapper>

								<ModalButtons>
									<Button
										type="submit"
										disabled={postEntriesMutation.isLoading}
									>
										Accept
									</Button>
								</ModalButtons>
							</Form>
						</ModalContent>
					</ModalWrapper>
				</Background>
			) : null}
		</>
  );
};

export default Modal;
