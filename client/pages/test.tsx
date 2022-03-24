import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { getEntries } from '../api/entries';

type Entry = {
  _id: string,
  category: string,
  income: boolean,
  amount: number,
};

const Test: NextPage = function Test() {
  const [entries, setEntries] = useState<Entry[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const getEntryRequest = async () => {
    let res = await getEntries();
    if (res) {
      setEntries(res.data.result);
      console.log(res);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEntryRequest();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        entries?.map((entry) => (
            <div key={entry._id}>
                <p>{entry.category}</p>
                <p>{entry.amount}</p>
            </div>
        ))
      )}
    </>
  );
};

export default Test;
