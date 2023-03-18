import React, { useRef } from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, InputWrapper, Input, Label, Select } from '../styles/Form';
import { Button, DangerButton } from '../styles/Button';
import { putEntries, deleteEntries } from '../../api/entries';
import * as S from './styles';
import { useMutation, useQueryClient } from 'react-query';

type IFormInputs = {
  category: string;
  amount: number;
  oldAmount: number;
  type: boolean;
};

type SelectedEditProps = {
  id: string;
  category: string;
  amount: number;
  type: boolean;
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
}: ModalProps) {
  const modalRef = useRef<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();

  const deleteEntriesMutation = useMutation(deleteEntries, {
    onSuccess: () => {
      setShowModal(false);
    },
  });
  const putEntriesMutation = useMutation(putEntries, {
    onSuccess: () => {
      queryClient.invalidateQueries('entries');
      queryClient.invalidateQueries('user');
      setShowModal(false);
    },
  });

  const onSubmit = (data: IFormInputs) => {
    data.type = selectedEdit.type;
    data.oldAmount = selectedEdit.amount;
    const entry = {
      id: selectedEdit.id,
      data,
    };
    putEntriesMutation.mutate(entry);
  };

  const handleDelete = () => {
    deleteEntriesMutation.mutate(selectedEdit.id);
  };

  const closeModal = (e: React.MouseEvent<HTMLElement>) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  return (
    <>
      <S.Background onClick={closeModal} ref={modalRef}>
        <S.ModalWrapper>
          <S.CloseModalButton
            aria-label="Close modal"
            onClick={() => setShowModal((prev) => !prev)}
          />
          <S.ModalContent>
            <h1>Edit entry</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <InputWrapper>
                <Label>Category</Label>
                {selectedEdit.type ? (
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
                  min={selectedEdit.type ? '0' : ''}
                  defaultValue={selectedEdit.amount}
                />
                <p>{errors.amount?.message}</p>
              </InputWrapper>

              <S.ModalButtons>
                <DangerButton onClick={() => handleDelete()}>
                  Delete
                </DangerButton>
                <Button
                  type="submit"
                  disabled={
                    putEntriesMutation.isLoading ||
                    deleteEntriesMutation.isLoading
                  }
                >
                  Accept
                </Button>
              </S.ModalButtons>
            </Form>
          </S.ModalContent>
        </S.ModalWrapper>
      </S.Background>
    </>
  );
};

export default Modal;
