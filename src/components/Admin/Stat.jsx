import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { API_BASE_URL } from '../../constants/api';

const Stat = () => {
  const [category, setCategory] = useState('daily');
  const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  const [statsData, setStatsData] = useState([]);
  const [summary, setSummary] = useState({ averageHit: 0, totalHit: 0, overAllTotalHit: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      };
      const year = selectedMonth.split('-')[0];
      const month = selectedMonth.split('-')[1];
  
      let url = `${API_BASE_URL}/api/hits?filteredBy=${category}&year=${year}`;
      if (category === 'daily' || category === 'weekly' ||  category === 'company') {
        url += `&month=${month}`;
      }
  
      try {
        const response = await axios.get(url, config);
        setStatsData(response.data.data.hits);
        setSummary({
          averageHit: response.data.data.averageHit,
          totalHit: response.data.data.totalHit,
          overAllTotalHit: response.data.data.overAllTotalHit
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  

    fetchData();
  }, [category, selectedMonth]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    if (event.target.value === 'monthly') {
      setSelectedMonth(`${new Date().getFullYear()}`);
    } else {
      setSelectedMonth(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    }
  };

  const inputType = category === 'monthly' ? 'year' : 'month';
  const maxHitValue = Math.max(summary.totalHit, summary.overAllTotalHit, summary.averageHit);
  const translateDay = (day) => {
    const dayTranslations = {
      "Monday": "월요일",
      "Tuesday": "화요일",
      "Wednesday": "수요일",
      "Thursday": "목요일",
      "Friday": "금요일",
      "Saturday": "토요일",
      "Sunday": "일요일"
    };
    return dayTranslations[day] || day;
  };
  return (
    <DashboardWrapper>
      <TableContainer>
        <HeaderContainer>
          <Title>상점 접속 현황</Title>
          <SearchSection>
            <input type={inputType} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ marginLeft: '10px' }} />
            <CategorySelect value={category} onChange={handleCategoryChange}>
              <option value="daily">일별</option>
              <option value="monthly">월별</option>
              <option value="weekly">요일별</option>
              <option value="company">업체별</option>
            </CategorySelect>
          </SearchSection>
        </HeaderContainer>
        <StatsTable>
          <TableHead>
            <TableRow>
              <TableHeader>날짜</TableHeader>
              <TableHeader>HIT</TableHeader>
              <TableHeader>접속 비율</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {statsData.map((item, index) => (
              <TableRow key={index}>
              <TableCell>
                {category === 'daily' ? `${item.name}일` : translateDay(item.name)}
              </TableCell>
                <HitCell>{item.hit}</HitCell>
                <GraphCell>
                  <ProgressBar>
                    <ProgressFill width={item.percentage} />
                  </ProgressBar>
                </GraphCell>
                <PercentageCell>{item.percentage}%</PercentageCell>
              </TableRow>
            ))}
            <SummaryRow>
              <TableCell>평균 접속 수</TableCell>
              <HitCell>{summary.averageHit.toFixed(1)}</HitCell>
              <GraphCell>
                <ProgressBar>
                  <ProgressFill width={(summary.averageHit / maxHitValue) * 100} />
                </ProgressBar>
              </GraphCell>
              <PercentageCell>{((summary.averageHit / maxHitValue) * 100).toFixed(2)}%</PercentageCell>
            </SummaryRow>
            <SummaryRow>
              <TableCell>총계</TableCell>
              <HitCell>{summary.totalHit}</HitCell>
              <GraphCell>
                <ProgressBar>
                  <ProgressFill width={(summary.totalHit / maxHitValue) * 100} />
                </ProgressBar>
              </GraphCell>
              <PercentageCell>{((summary.totalHit / maxHitValue) * 100).toFixed(2)}%</PercentageCell>
            </SummaryRow>
            <SummaryRow>
              <TableCell>누적 총계</TableCell>
              <HitCell>{summary.overAllTotalHit}</HitCell>
              <GraphCell>
                <ProgressBar>
                  <ProgressFill width={(summary.overAllTotalHit / maxHitValue) * 100} />
                </ProgressBar>
              </GraphCell>
              <PercentageCell>{((summary.overAllTotalHit / maxHitValue) * 100).toFixed(2)}%</PercentageCell>
            </SummaryRow>
          </tbody>
        </StatsTable>
      </TableContainer>
    </DashboardWrapper>
  );
};

export default Stat;




const DashboardWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 3% 10px;
  align-items: center;
  margin-left: 280px;
  @media(max-width: 780px){
    margin-left: 0px;
    margin-top: 4%;
  }
`;

const TableContainer = styled.div`
  width: 95%;
  margin: 2% 0;
  @media(max-width: 780px){
    width: 90%;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 2.3rem;
  font-weight: bold;
  @media(max-width: 780px){
    font-size: 1.9rem;
  }
`;
const SearchSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  input{
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1.2rem;
    max-width: 120px;
    margin-right: 10px;
  }
  @media(max-width: 780px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const CategorySelect = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1.2rem;
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f0f0f0;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 15px;
  font-size: 1.2rem;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
`;

const TableCell = styled.td`
  padding: 15px;
  font-size: 1rem;
`;

const HitCell = styled.td`
  padding: 15px;
  font-size: 1rem;
  font-weight: bold;
`;

const GraphCell = styled.td`
  width: 50%;
  padding: 15px;
`;

const ProgressBar = styled.div`
  background-color: #e8f0fe;
  border-radius: 10px;
  overflow: hidden;
  height: 25px;
`;

const ProgressFill = styled.div`
  background-color: #4d8ef5;
  height: 100%;
  width: ${props => props.width}%;
`;

const PercentageCell = styled.td`
  padding: 15px;
  text-align: right;
  font-size: 1rem;
  align-items: center;
`;
const DateInput = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: auto;

  @media(max-width: 780px) {
    max-width: 700px;
    width: 70%;
  }
`;

const SummaryRow = styled.tr`
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
`;