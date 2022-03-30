import React, { useRef } from 'react';
import styled from 'styled-components';
import { NextPage } from 'next';
import { MdClose } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as F from '../styles/Form';
import { Button } from '../styles/Button';
import { postEntries } from '../../api/entries';

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 30%;
  @media (max-width: 1200px) {
    width: 40%;
  }
  @media (max-width: 850px) {
    width: 60%;
  }
  @media (max-width: 600px) {
    width: 90%;
  }
  height: auto;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: ${({ theme }) => theme.background};
  color: #000;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  width: 90%;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 28px;
  height: 28px;
  padding: 0;
  z-index: 10;
`;

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
