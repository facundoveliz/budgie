import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { getEntries } from '../api/entries';
import styled from 'styled-components';
import { Button } from '../components/styles/Button';
import Entry from '../components/index/entry';
import Modal from '../components/index/modal';

type EntryProp = {
  _id: string;
  category: string;
  income: boolean;
  amount: number;
  created: Date;
};

// TODO: move styles to a dedicated folder
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  h1 {
    font-size: 24px;
    letter-spacing: 2px;
    width: 240px;
    text-align: center;
  }
  button {
    margin: 0 10px 30px;
  }
`;

const Balance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px 0;
  font-size: 18px;
  p {
    font-weight: bold;
    font-size: 24px;
  }
`;

const Home: NextPage = function Home() {
  const [entries, setEntries] = useState<EntryProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [income, setIncome] = useState(false);

  const getEntryRequest = async () => {
    const res = await getEntries();
    if (res) {
      setEntries(res.data.result);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEntryRequest();
  }, []);

  console.log();
  return (
    <Wrapper>
      <Balance>
        Account balance <p>$0.00</p>
      </Balance>
      <div>
        <Button
          secondary
          onClick={() => {
            setIncome(false);
            setShowModal((prev) => !prev);
          }}
        >
          Expense
        </Button>
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
        income={income}
      />
      {loading ? (
        <p>Loading...</p>
      ) : entries.length <= 0 ? (
        <h1>No entries were founded.</h1>
      ) : (
        <Entry entries={entries} />
      )}
    </Wrapper>
  );
};

export default Home;
