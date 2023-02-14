import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ReactEcharts from 'echarts-for-react';
import { getEntries } from '../api/entries';
import { getUser } from '../api/users';
import Entry from '../components/index/entry';
import Modal from '../components/modals/addEntry';
import { Button, SecondaryButton } from '../components/styles/Button';
import * as S from '../components/index/styles';
import { Loading } from '../components/styles/Loading';
import { format } from 'date-fns';

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
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [lineData, setLineData] = useState({});

  const categories = {
    income: ['Savings', 'Salary', 'Gift', 'Other'],
    expense: [
      'Food & Drinks',
      'Shopping',
      'Groceries',
      'Transport',
      'Health',
      'Life & Entertainment',
      'Home',
      'Gift',
      'Other',
    ],
  };

  const optionLine = {
    title: {
      text: 'Balance history',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Income', 'Expense'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: lineData.created,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Income',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: lineData.income,
      },
      {
        name: 'Expense',
        type: 'line',
        smooth: true,
        stack: 'Total',
        data: lineData.expense,
      },
    ],
  };

  // FIX: merge this into one
  const optionIncome = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      align: 'right',
      bottom: '0',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          fontSize: 0,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        data: incomeData,
      },
    ],
  };

  const optionExpense = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      align: 'right',
      bottom: '0',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          fontSize: 0,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        data: expenseData,
      },
    ],
  };

  const setLineDataFunc = () => {
    const day = entries.reduce(
      (acc, entry) => {
        const dt = new Date(entry.created);
        const dtDateOnly = new Date(
          dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000,
        );

        const date = format(dtDateOnly, 'd/M/yy');
        const index = acc.created.indexOf(date);
        if (index === -1) {
          acc.created.push(date);
          acc.income.push(entry.type ? entry.amount : 0);
          acc.expense.push(!entry.type ? entry.amount : 0);
        } else {
          acc.income[index] += entry.type ? entry.amount : 0;
          acc.expense[index] += !entry.type ? entry.amount : 0;
        }
        return acc;
      },
      { created: [], income: [], expense: [] },
    );
    return day;
  };

  const setCategoriesData = (e: EntryProp[]) => {
    let finalIncome = [];
    let finalExpense = [];

    // Loops through the entire entries
    for (let i = 0; i < e.length; i++) {
      // Variable naming for less typing and more readability
      let category = e[i].category;
      let amount = e[i].amount;

      // Checks if the current category is an income of an expense
      if (e[i].type) {
        // Checks if the category is matched and it doesnt repeat
        if (
          categories.income.includes(category) &&
          finalIncome.map((c) => c.name).indexOf(category) === -1
        ) {
          finalIncome.push({ value: amount, name: category });
        } else {
          // If is repeted it will push the current value to the
          // existent entry
          finalIncome.find((o, x) => {
            if (o.name === category) {
              finalIncome[x] = { value: o.value + amount, name: category };
              return true; // Stop searching
            }
          });
        }
        // Does the same but with expenses
      } else {
        if (
          categories.expense.includes(category) &&
          finalExpense.map((c) => c.name).indexOf(category) === -1
        ) {
          finalExpense.push({
            // Use Math.abs() for making the number positive, echarts
            // like it this way
            value: Math.abs(amount),
            name: category,
          });
        } else {
          finalExpense.find((o, x) => {
            if (o.name === category) {
              finalExpense[x] = {
                value: Math.abs(o.value - amount),
                name: category,
              };
              return true; // Stop searching
            }
          });
        }
      }
    }

    return {
      finalIncome,
      finalExpense,
    };
  };

  const getPrices = async (e: EntryProp) => {
    let inc = 0;
    let exp = 0;
    e.map((en) => {
      if (en.type) {
        inc += en.amount;
      } else {
        exp += en.amount;
      }
    });
    setIncome(inc);
    setExpense(exp);
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

  useEffect(() => {
    getEntryRequest();
    getUserRequest();
  }, []);

  useEffect(() => {
    const res = setCategoriesData(entries);
    setExpenseData(res.finalExpense);
    setIncomeData(res.finalIncome);
    // FIX: executing two times
    getPrices(entries); // TODO: <- merge this and setLineData into one object
    const resLine = setLineDataFunc(entries);
    setLineData(resLine);
  }, [entries]);

  return (
    <>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <S.Wrapper>
          <S.Empty>
            <ReactEcharts option={optionLine} />
          </S.Empty>
          <S.Grid1>
            <S.BalanceWrapper>
              <S.Balance>
                Account balance <p>{`$${user!.balance}.00 `}</p>
                <div>
                  <Button
                    onClick={() => {
                      setType(true);
                      setShowModal((prev) => !prev);
                    }}
                  >
                    Income
                  </Button>
                  <SecondaryButton
                    onClick={() => {
                      setType(false);
                      setShowModal((prev) => !prev);
                    }}
                  >
                    Expense
                  </SecondaryButton>
                </div>
              </S.Balance>
              <S.Balance>
                Savings <p>{`$${user!.balance}.00 `}</p>
              </S.Balance>
            </S.BalanceWrapper>
            <S.DoughtnutWrapper>
              <S.Doughtnut>
                <h3>Total Income</h3>
                <p>${income}</p>
                <ReactEcharts option={optionIncome} />
              </S.Doughtnut>
              <S.Doughtnut>
                <h3>Total Expenses</h3>
                <p>${expense}</p>
                <ReactEcharts option={optionExpense} />
              </S.Doughtnut>
            </S.DoughtnutWrapper>
          </S.Grid1>
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
        </S.Wrapper>
      )}
    </>
  );
};

export default Home;
