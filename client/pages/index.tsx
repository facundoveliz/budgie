import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { getEntries } from '../api/entries';
import { Button, SecondaryButton } from '../components/styles/Button';
import Entry from '../components/index/entry';
import Modal from '../components/index/addEntryModal';
import { Balance, Wrapper } from '../components/index/styles';
import { getUser } from '../api/users';
import { Loading } from '../components/styles/Loading';

type EntryProp = {
  _id: string;
  category: string;
  income: boolean;
  amount: number;
  created: Date;
};

type UserProp = {
  _id: string;
  email: string;
  name: string;
  balance: number;
  created: Date;
};

const Home: NextPage = function Home() {
  const [entries, setEntries] = useState<EntryProp[]>([]);
  const [user, setUser] = useState<UserProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [income, setIncome] = useState(false);

  const getEntryRequest = async () => {
    const res = await getEntries();
    if (res) {
      setEntries(res.data.result);
    }
  };

  const getUserRequest = async () => {
    setLoading(true);
    const res = await getUser();
    if (res) {
      setUser(res.data.result);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEntryRequest();
    getUserRequest();
  }, []);

  return (
    <>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Wrapper>
          <Balance>
            Account balance <p>{`$${user.balance}.00 `}</p>
          </Balance>
          <div>
            <SecondaryButton
              onClick={() => {
                setIncome(false);
                setShowModal((prev) => !prev);
              }}
            >
              Expense
            </SecondaryButton>
            <Button
              onClick={() => {
                setIncome(true);
                setShowModal((prev) => !prev);
              }}
            >
              Income
            </Button>
          </div>
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            getEntryRequest={getEntryRequest}
            getUserRequest={getUserRequest}
            income={income}
          />
          {loading ? (
            <p>Loading...</p>
          ) : entries.length <= 0 ? (
            <h1>No entries were founded.</h1>
          ) : (
            <Entry
              entries={entries}
              getEntryRequest={getEntryRequest}
              getUserRequest={getUserRequest}
            />
          )}
        </Wrapper>
      )}
    </>
  );
};

export default Home;
