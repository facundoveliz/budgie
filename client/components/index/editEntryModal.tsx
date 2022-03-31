import React, { useRef } from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, InputWrapper, Input, Label, Select } from '../styles/Form';
import { Button } from '../styles/Button';
import { putEntries, deleteEntries } from '../../api/entries';
import {
  Background,
  CloseModalButton,
  ModalButtons,
  ModalContent,
  ModalWrapper,
} from './styles';

type IFormInputs = {
  category: string;
  amount: number;
  oldAmount: number;
  income: boolean;
};

type SelectedEditProps = {
  id: string;
  category: string;
  amount: number;
  income: boolean;
};

type ModalProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEdit: SelectedEditProps;
  getEntryRequest: () => Promise<void>;
  getUserRequest: () => Promise<void>;
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
  setShowModal,
  selectedEdit,
  getEntryRequest,
  getUserRequest,
}: ModalProps) {
  const modalRef = useRef<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) => {
    data.income = selectedEdit.income;
    data.oldAmount = selectedEdit.amount;

    putEntries(selectedEdit.id, data).then(() => {
      getEntryRequest().then(() => {
        getUserRequest().then(() => {
          setShowModal(false);
        });
      });
    });
  };

  const handleDelete = () => {
    deleteEntries(selectedEdit.id).then(() => {
      getEntryRequest().then(() => {
        setShowModal(false);
      });
    });
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  return (
    <>
      <Background onClick={closeModal} ref={modalRef}>
        <ModalWrapper>
          <CloseModalButton
            aria-label="Close modal"
            onClick={() => setShowModal((prev) => !prev)}
          />
          <ModalContent>
            <h1>Edit entry</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputWrapper>
                <Label>Category</Label>
                {selectedEdit.income ? (
                  <Select
                    {...register('category')}
                    defaultValue={selectedEdit.category}
                  >
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
                  </Select>
                )}
                <p>{errors.category?.message}</p>
              </InputWrapper>

              <InputWrapper>
                <Label>Amount</Label>
                <Input
                  {...register('amount')}
                  type="number"
                  min={selectedEdit.income ? '0' : ''}
                  defaultValue={selectedEdit.amount}
                />
                <p>{errors.amount?.message}</p>
              </InputWrapper>

              <ModalButtons>
                <Button secondary onClick={() => handleDelete()}>
                  Delete
                </Button>
                <Button type="submit">Accept</Button>
              </ModalButtons>
            </Form>
          </ModalContent>
        </ModalWrapper>
      </Background>
    </>
  );
};

export default Modal;
