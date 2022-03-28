import React from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';

type EntryPropContent = {
  _id: string;
  category: string;
  income: boolean;
  amount: number;
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
  width: 80vw;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-of-type {
    border: 0;
  }
`;

const Paragraph = styled.p<EntryStyleProps>`
  &:last-of-type {
    letter-spacing: 1px;
    color: ${(props) =>
    props.income
      ? ({ theme }) => theme.primary
      : ({ theme }) => theme.secondary};
  }
`;

const Entry: NextPage<EntryProps> = function Entry({ entries }: EntryProps) {
  return (
    <>
      {entries?.map((entry) => (
        <EntryWrapper key={entry._id}>
          <Paragraph>{entry.category}</Paragraph>
          <Paragraph income={entry.income}>${entry.amount},00</Paragraph>
        </EntryWrapper>
      ))}
    </>
  );
};

export default Entry;
