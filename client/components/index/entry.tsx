import React from 'react';
import { NextPage } from 'next';
import dateFormat, { masks } from 'dateformat';
import { EntryWrapper, Paragraph } from './styles';

type EntryPropContent = {
  _id: string;
  category: string;
  income: boolean;
  amount: number;
  created: Date;
};

type EntryProps = {
  entries: EntryPropContent[];
};

const Entry: NextPage<EntryProps> = function Entry({ entries }: EntryProps) {
  return (
    <>
      {entries?.map((entry) => (
        <EntryWrapper key={entry._id}>
          <p>{entry.category}</p>
          <div>
            <Paragraph income={entry.income}>${entry.amount},00</Paragraph>
            <Paragraph>{dateFormat(entry.created, 'HH:MM, mmmm d')}</Paragraph>
          </div>
        </EntryWrapper>
      ))}
    </>
  );
};

export default Entry;
