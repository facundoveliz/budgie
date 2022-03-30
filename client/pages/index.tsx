import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { getEntries } from '../api/entries';
import { Button } from '../components/styles/Button';
import Entry from '../components/index/entry';
import Modal from '../components/index/modal';
import { Balance, Wrapper } from '../components/index/styles';

type EntryProp = {
  _id: string;
  category: string;
  income: boolean;
  amount: number;
  created: Date;
};

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
