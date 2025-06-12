import React from 'react';
import { Line } from 'react-chartjs-2';
import { Col, Row, Typography } from 'antd';
import 'chart.js/auto';  

const { Title } = Typography;

const LineChart = ({ coinHistory, currentPrice, coinName }) => {
  // Extract data from the response
  const coinPrice = [];
  const coinTimestamp = [];

  // Convert object to array if necessary
  const historyArray = Object.values(coinHistory?.data?.history || {});

  for (let i = 0; i < historyArray.length; i += 1) {
    coinPrice.push(historyArray[i].price);
    coinTimestamp.push(new Date(historyArray[i].timestamp * 1000).toLocaleDateString()); // Convert timestamp to milliseconds
  }

  const data = {
    labels: coinTimestamp,
    datasets: [
      {
        label: 'Price In USD',
        data: coinPrice,
        fill: false,
        backgroundColor: '#0071bd',
        borderColor: '#0071bd',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Row className="chart-header">
        <Title level={2} className="chart-title">{coinName} Price Chart</Title>
        <Col className="price-container">
          <Title level={5} className="price-change">Change: {coinHistory?.data?.change}%</Title>
          <Title level={5} className="current-price">Current {coinName} Price: $ {currentPrice}</Title>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  );
};

export default LineChart;
