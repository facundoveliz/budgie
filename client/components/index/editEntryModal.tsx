import React, { useRef } from 'react';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Form,
  SubmitWrapper,
  InputWrapper,
  Input,
  Label,
  Select,
} from '../styles/Form';
import { Button } from '../styles/Button';
import { putEntries } from '../../api/entries';
import {
  Background,
  CloseModalButton,
  ModalContent,
  ModalWrapper,
} from './styles';

type IFormInputs = {
  category: string;
  amount: number;
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
    // FIX: add res = ... for makings sure is getting a response before closing modal
    data.income = selectedEdit.income;
    putEntries(selectedEdit.id, data).then(() => {
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
                  <Select {...register('category')}>
                    <option
                      selected={selectedEdit.category === 'Other'}
                      value="Other"
                    >
                      Other
                    </option>
                    <option
                      selected={selectedEdit.category === 'Savings'}
                      value="Savings"
                    >
                      Savings
                    </option>
                    <option
                      selected={selectedEdit.category === 'Salary'}
                      value="Salary"
                    >
                      Salary
                    </option>
                    <option
                      selected={selectedEdit.category === 'Gift'}
                      value="Gift"
                    >
                      Gift
                    </option>
                  </Select>
                ) : (
                  <Select {...register('category')}>
                    <option
                      selected={selectedEdit.category === 'Other'}
                      value="Other"
                    >
                      Other
                    </option>
                    <option
                      selected={selectedEdit.category === 'Food & Drinks'}
                      value="Food & Drinks"
                    >
                      Food & Drinks
                    </option>
                    <option
                      selected={selectedEdit.category === 'Groceries'}
                      value="Groceries"
                    >
                      Groceries
                    </option>
                    <option
                      selected={selectedEdit.category === 'Transport'}
                      value="Transport"
                    >
                      Transport
                    </option>
                    <option
                      selected={selectedEdit.category === 'Health'}
                      value="Health"
                    >
                      Health
                    </option>
                    <option
                      selected={
                        selectedEdit.category === 'Life & Entertainment'
                      }
                      value="Life & Entertainment"
                    >
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

              <SubmitWrapper>
                <Button secondary>Delete</Button>
                <Button type="submit">Accept</Button>
              </SubmitWrapper>
            </Form>
          </ModalContent>
        </ModalWrapper>
      </Background>
    </>
  );
};

export default Modal;
