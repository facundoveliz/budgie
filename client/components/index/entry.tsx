import React, { useState } from 'react';
import { NextPage } from 'next';
import dateFormat from 'dateformat';
import Modal from '../modals/editEntry';
import styled from 'styled-components';

type EntryPropContent = {
  _id: string;
  category: string;
  type: boolean;
  amount: number;
  created: Date;
};

type EntryProps = {
  entries: EntryPropContent[];
  getEntryRequest: () => Promise<void>;
  getUserRequest: () => Promise<void>;
};

type SelectedEditProps = {
  id: string;
  category: string;
  amount: number;
  type: boolean;
};

const Entry: NextPage<EntryProps> = function Entry({
  entries,
  getEntryRequest,
  getUserRequest,
}: EntryProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEdit, setSelectedEdit] = useState<SelectedEditProps>({
    id: '',
    category: '',
    amount: 0,
    type: true,
  });

  return (
    <EntriesWrapper>
      {entries?.map((entry) => (
        <div key={entry._id}>
          <EntryWrapper
            onClick={() => {
              setSelectedEdit({
                id: entry._id,
                category: entry.category,
                amount: entry.amount,
                type: entry.type,
              });
              setShowModal((prev) => !prev);
            }}
          >
            <p>{entry.category}</p>
            <ParagraphWrapper>
              <div>
                <Paragraph type={entry.type}>${entry.amount},00</Paragraph>
                <Paragraph>
                  {dateFormat(entry.created, 'HH:MM, mmmm d')}
                </Paragraph>
              </div>
            </ParagraphWrapper>
          </EntryWrapper>
        </div>
      ))}
      <>
        {showModal ? (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            selectedEdit={selectedEdit}
            getEntryRequest={getEntryRequest}
            getUserRequest={getUserRequest}
          />
        ) : null}
      </>
    </EntriesWrapper>
  );
};

export default Entry;

type EntryStyleProps = {
  readonly type?: boolean;
};

// FIX: make a softer bg
const EntryWrapper = styled.div<EntryStyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${({ theme }) => theme.paddings.dashboard};
  border-radius: ${({ theme }) => theme.borders.radius};
  border-bottom: 1px solid ${({ theme }) => theme.border} !important;
  &:hover {
    background: ${({ theme }) => theme.background};
  }
`;

const EntriesWrapper = styled.div<EntryStyleProps>`
  background: ${({ theme }) => theme.backgroundSoft};
`;

export const ParagraphWrapper = styled.div`
  display: flex;
`;

export const Paragraph = styled.p<EntryStyleProps>`
  color: ${(props) =>
    props.type ? ({ theme }) => theme.primary : ({ theme }) => theme.danger};
  &:last-of-type {
    font-size: 14px;
    color: ${({ theme }) => theme.foreground};
    float: right;
  }
`;
