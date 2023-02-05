import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getEntries } from '../api/entries';
import { Button, SecondaryButton } from '../components/styles/Button';
import Entry from '../components/index/entry';
import Modal from '../components/index/addEntryModal';
import { Balance, PieWrapper, Wrapper } from '../components/index/styles';
import { getUser } from '../api/users';
import { Loading } from '../components/styles/Loading';

type EntryProp = {
  _id: string;
  category: string;
  type: boolean;
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

ChartJS.register(ArcElement, Tooltip, Legend);

const Home: NextPage = function Home() {
  const [entries, setEntries] = useState<EntryProp[]>([]);
  const [user, setUser] = useState<UserProp>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [type, setType] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [categoriesExpenseAmount, setCategoriesExpenseAmount] = useState([]);
  const [categoriesIncomeAmount, setCategoriesIncomeAmount] = useState([]);

  const categoriesIncomeList = ['Savings', 'Salary', 'Gift', 'Other'];
  const categoriesExpenseList = [
    'Food & Drinks',
    'Shopping',
    'Groceries',
    'Transport',
    'Health',
    'Life & Entertainment',
    'Home',
    'Gift',
    'Other',
  ];

  const dataExpense = {
    labels: categoriesExpenseList,
    datasets: [
      {
        label: '# of Votes',
        data: categoriesExpenseAmount,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
        weight: 4,
      },
    ],
  };

  const dataIncome = {
    labels: categoriesIncomeList,
    datasets: [
      {
        label: '# of Votes',
        data: categoriesIncomeAmount,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const getCategoriesNumber = (entry: EntryProp) => {
    let finalIncome = Array(categoriesIncomeList.length).fill(0);
    let finalExpense = Array(categoriesExpenseList.length).fill(0);

    for (let i = 0; i < entry.length; i++) {
      let category = entry[i].category;
      let amount = entry[i].amount;
      if (categoriesIncomeList.includes(category)) {
        let index = categoriesIncomeList.indexOf(category);
        finalIncome[index] += amount;
      } else if (categoriesExpenseList.includes(category)) {
        let index = categoriesExpenseList.indexOf(category);
        finalExpense[index] += amount;
      }
    }

    const results = {
      finalIncome,
      finalExpense,
    };

    return results;
  };

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

  const getPrices = async () => {
    let inc = 0;
    let exp = 0;
    entries.map((entry) => {
      if (entry.income) {
        inc += entry.amount;
      } else {
        exp += entry.amount;
        setExpense(exp);
      }
      setIncome(inc);
      setExpense(exp);
      console.log(income, expense, entry.category);
    });
  };

  useEffect(() => {
    getEntryRequest();
    getUserRequest();
  }, []);

  useEffect(() => {
    const amountData = getCategoriesNumber(entries);
    setCategoriesExpenseAmount(amountData.finalExpense);
    setCategoriesIncomeAmount(amountData.finalIncome);
  }, [entries]);

  return (
    <>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Wrapper>
          <Balance>
            Account balance <p>{`$${user!.balance}.00 `}</p>
          </Balance>
          <div>
            <SecondaryButton
              onClick={() => {
                setType(false);
                setShowModal((prev) => !prev);
              }}
            >
              Expense
            </SecondaryButton>
            <Button
              onClick={() => {
                setType(true);
                setShowModal((prev) => !prev);
              }}
            >
              Income
            </Button>
          </div>
          <PieWrapper>
            <div>
              <h3>Expenses</h3>
              <p>${expense}</p>
              <Doughnut options={options} data={dataExpense} />
            </div>
            <div>
              <h3>Incomes</h3>
              <p>${income}</p>
              <Doughnut options={options} data={dataIncome} />
            </div>
          </PieWrapper>
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            getEntryRequest={getEntryRequest}
            getUserRequest={getUserRequest}
            type={type}
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
