import React from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import dateFormat, { masks } from 'dateformat';

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

type EntryStyleProps = {
  readonly income?: boolean;
};

const EntryWrapper = styled.div<EntryStyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  width: 40vw;
  @media (max-width: 1200px) {
    width: 80vw;
  }
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-of-type {
    border: 0;
  }
`;

const Paragraph = styled.p<EntryStyleProps>`
  color: ${(props) =>
    props.income
      ? ({ theme }) => theme.primary
      : ({ theme }) => theme.secondary};
  &:last-of-type {
    font-size: 14px;
    color: ${({ theme }) => theme.foregroundSoft};
  }
`;

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
