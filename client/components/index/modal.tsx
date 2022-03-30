import React, { useRef } from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as F from '../styles/Form';
import { Button } from '../styles/Button';
import { postEntries } from '../../api/entries';
import {
  Background,
  CloseModalButton,
  ModalContent,
  ModalWrapper,
} from './styles';

type IFormInputs = {
  category: string;
  income: boolean;
  amount: number;
};

type ModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  getEntryRequest: () => Promise<void>;
  income: boolean;
};

const schema = yup
  .object({
    category: yup
      .string()
      .required('The category is a required field.')
      .oneOf([
        'Savings',
        'Salary',
        'Gift',
        'Other',
        'Food & Drinks',
        'Shopping',
        'Groceries',
        'Transport',
        'Health',
        'Life & Entertainment',
        'Home',
        'Gift',
        'Other',
      ]),
    amount: yup.number().required('The amount is a required field.'),
  })
  .required();

const Modal: NextPage<ModalProps> = function Modal({
  showModal,
  setShowModal,
  getEntryRequest,
  income,
}: ModalProps) {
  const modalRef = useRef<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) =>
    postEntries(data).then(() => {
      getEntryRequest().then(() => {
        setShowModal(false);
      });
    });

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
              <F.Form onSubmit={handleSubmit(onSubmit)}>
                <F.InputWrapper>
                  <F.Label>Category</F.Label>
                  {income ? (
                    <F.Select {...register('category')}>
                      <option value="Other">Other</option>
                      <option value="Savings">Savings</option>
                      <option value="Salary">Salary</option>
                      <option value="Gift">Gift</option>
                    </F.Select>
                  ) : (
                    <F.Select {...register('category')}>
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
                    </F.Select>
                  )}
                  <p>{errors.category?.message}</p>
                </F.InputWrapper>

                <F.InputWrapper>
                  <F.Label>Amount</F.Label>
                  <F.Input {...register('amount')} type="number" min="0" />
                  <p>{errors.amount?.message}</p>
                </F.InputWrapper>

                <F.SubmitWrapper>
                  <Button type="submit">Accept</Button>
                </F.SubmitWrapper>
              </F.Form>
              <div></div>
            </ModalContent>
          </ModalWrapper>
        </Background>
      ) : null}
    </>
  );
};

export default Modal;
