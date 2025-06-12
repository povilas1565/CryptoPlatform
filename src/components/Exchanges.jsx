import React, { useState, useEffect, useRef } from 'react';
import millify from 'millify';
import { Input, Row, Col, Typography, Avatar, Card } from 'antd';
import Loader from './Loader';

const { Title, Text } = Typography;
const { Search } = Input;

const Exchanges = () => {
  const [exchangesList, setExchangesList] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    const fetchExchanges = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/exchanges`);
        const data = await response.json();
        setExchangesList(data);
        setFilteredExchanges(data.slice(0, 20)); // Show top 20 initially
      } catch (error) {
        console.error('Error fetching exchange data:', error);
      }
      setLoading(false);
    };

    fetchExchanges();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      setFilteredExchanges(exchangesList.filter((exchange) =>
        exchange.name.toLowerCase().includes(value.toLowerCase())
      ));
    } else {
      setFilteredExchanges(exchangesList.slice(0, 20));
    }
  };

  const lastExchangeRef = (node) => {
    if (loading || searchTerm) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
        setFilteredExchanges((prev) => [
          ...prev,
          ...exchangesList.slice(prev.length, prev.length + 10),
        ]);
      }
    });
    if (node) observer.current.observe(node);
  };

  if (loading && exchangesList.length === 0) return <Loader />;

  return (
    <>
      <Title level={2} className="heading">Top Cryptocurrency Exchanges</Title>
      <Search
        placeholder="Search Exchange"
        enterButton
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 20, width: 300 }}
      />
      <Row gutter={[24, 24]}>
        {filteredExchanges.map((exchange, index) => (
          <Col xs={24} sm={12} lg={8} key={exchange.id} ref={index === filteredExchanges.length - 1 ? lastExchangeRef : null}>
            <Card hoverable className="exchange-card">
              <Row align="middle">
                <Col span={6}>
                  <Avatar size="large" src={exchange.image} />
                </Col>
                <Col span={18}>
                  <Title level={4}>{exchange.name}</Title>
                  <Text>Trust Score: {exchange.trust_score}</Text>
                  <br />
                  <Text>24h Volume: {millify(exchange.trade_volume_24h_btc)} BTC</Text>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      {loading && <Loader />}
    </>
  );
};

export default Exchanges;
