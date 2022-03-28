import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { getEntries } from '../api/entries';
import styled from 'styled-components';
import { Button } from '../components/styles/Button';
import Entry from '../components/index/entry';

type EntryProp = {
  _id: string;
  category: string;
  income: boolean;
  amount: number;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  padding: 0 16px;
  h1 {
    font-size: 24px;
    letter-spacing: 2px;
    width: 240px;
    text-align: center;
  }
`;

const Balance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home: NextPage = function Home() {
  const [entries, setEntries] = useState<EntryProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        Account balance <h1>$0.00</h1>
      </Balance>
      {loading ? (
        <p>Loading...</p>
      ) : entries.length <= 0 ? (
        <h1>No entries were founded.</h1>
      ) : (
        <Entry entries={entries} />
      )}
      <Button>Add entry</Button>
    </Wrapper>
  );
};

export default Home;
