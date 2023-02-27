import React, { useState } from 'react';
import { NextPage } from 'next';
import dateFormat from 'dateformat';
import { EntryWrapper, Paragraph, ParagraphWrapper } from './styles';
import Modal from './editEntryModal';

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
    <>
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
    </>
  );
};

export default Entry;
