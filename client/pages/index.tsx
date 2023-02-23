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

  const options = [
    {
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
          smooth: 'true',
          data: lineData.income,
        },
        {
          name: 'Expense',
          type: 'line',
          smooth: 'true',
          data: lineData.expense,
        },
      ],
    },
    {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '-2%',
        type: 'scroll',
        icon: 'circle',
        width: '80%',
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
    },
    {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '-2%',
        type: 'scroll',
        icon: 'circle',
        width: '80%',
      },
      series: [
        {
          backgroundColor: 'rgba(255, 34, 34, 1)',
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
    },
  ];

  const handleLineData = (entries) => {
    const data = entries.reduce(
      (accumulator, entry) => {
        const dt = new Date(entry.created);
        const dtDateOnly = new Date(
          dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000,
        );
        const date = format(dtDateOnly, 'd/M/yy');

        const index = accumulator.created.indexOf(date);
        if (index === -1) {
          accumulator.created.push(date);
          accumulator.income.push(entry.type ? entry.amount : 0);
          accumulator.expense.push(!entry.type ? Math.abs(entry.amount) : 0);
        } else {
          accumulator.income[index] += entry.type ? entry.amount : 0;
          accumulator.expense[index] += !entry.type
            ? Math.abs(entry.amount)
            : 0;
        }
        return accumulator;
      },
      { created: [], income: [], expense: [] },
    );
    setLineData(data);
  };

  const handleCategoriesData = (e: EntryProp[]) => {
    let finalIncome = [];
    let finalExpense = [];

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

    // Loops through the entire entries
    for (let i = 0; i < e.length; i++) {
      // Variable naming for less typing and more readability
      let category = e[i].category;
      let amount = Math.abs(e[i].amount);

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
            value: amount,
            name: category,
          });
        } else {
          finalExpense.find((o, x) => {
            if (o.name === category) {
              finalExpense[x] = {
                value: o.value + amount,
                name: category,
              };
              return true; // Stop searching
            }
          });
        }
      }
    }

    setExpenseData(finalExpense);
    setIncomeData(finalIncome);
  };

  const handlePrices = async (e: EntryProp) => {
    let inc = 0;
    let exp = 0;
    e.forEach((en) => {
      en.type ? (inc += en.amount) : (exp += Math.abs(en.amount));
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
    handleCategoriesData(entries);
    handleLineData(entries);
    handlePrices(entries);
  }, [entries]);

  return (
    <>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <S.Wrapper>
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
                <ReactEcharts option={options[1]} />
              </S.Doughtnut>
              <S.Doughtnut>
                <h3>Total Expenses</h3>
                <p>${expense}</p>
                <ReactEcharts option={options[2]} />
              </S.Doughtnut>
            </S.DoughtnutWrapper>
          </S.Grid1>
          <S.LineWrapper>
            <h3>Balance history</h3>
            <ReactEcharts option={options[0]} />
          </S.LineWrapper>
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
            // TODO: improve loading system, research
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
