import React, { useState, useEffect } from 'react';
import { Typography, Collapse, Switch, List, Avatar, Select, InputNumber, Row, Col, Card, Button, Input, Form } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const Features = () => {
  const [enabledFeatures, setEnabledFeatures] = useState({
    priceTracking: true,
    exchangeComparisons: true,
    marketSentiment: true,
    cryptoEvents: true
  });

  const [cryptoData, setCryptoData] = useState([]);
  const [coinsList, setCoinsList] = useState([]);
  const [amount, setAmount] = useState(1);
  const [fromCoin, setFromCoin] = useState('bitcoin');
  const [toCoin, setToCoin] = useState('ethereum');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [fearGreedIndex, setFearGreedIndex] = useState(null);
  const [cryptoEvents, setCryptoEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', country: '' });

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, page: 1, sparkline: false }
        });
        setCryptoData(data);
        setCoinsList(data.map(coin => ({ id: coin.id, name: coin.name, symbol: coin.symbol })));
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const { data } = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
          params: { ids: `${fromCoin},${toCoin}`, vs_currencies: 'usd' }
        });

        if (data[fromCoin] && data[toCoin]) {
          const fromPrice = data[fromCoin].usd;
          const toPrice = data[toCoin].usd;
          setConvertedAmount((amount * fromPrice) / toPrice);
        }
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    fetchConversionRate();
  }, [amount, fromCoin, toCoin]);

  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        const { data } = await axios.get('https://api.alternative.me/fng/');
        setFearGreedIndex(data.data[0]);
      } catch (error) {
        console.error('Error fetching Fear and Greed Index:', error);
      }
    };

    fetchFearGreedIndex();
  }, []);

  useEffect(() => {
    const fetchCryptoEvents = async () => {
      try {
        const { data } = await axios.get('https://api.coingecko.com/api/v3/events');
        setCryptoEvents(data.data);
      } catch (error) {
        console.error('Error fetching crypto events:', error);
      }
    };

    fetchCryptoEvents();
  }, []);

  const addEvent = () => {
    setCryptoEvents([...cryptoEvents, { ...newEvent, id: Date.now() }]);
    setNewEvent({ title: '', date: '', country: '' });
  };

  const deleteEvent = (id) => {
    setCryptoEvents(cryptoEvents.filter(event => event.id !== id));
  };

  const toggleFeature = (key) => {
    setEnabledFeatures((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="features-container">
      <Title level={2}>Key Features</Title>
      <Collapse accordion>
        <Panel header="Real-time Crypto Price Tracking" key="priceTracking" extra={<Switch checked={enabledFeatures.priceTracking} onChange={() => toggleFeature('priceTracking')} />}>
          {enabledFeatures.priceTracking && (
            <List
              itemLayout="horizontal"
              dataSource={cryptoData}
              renderItem={coin => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={coin.image} />}
                    title={`${coin.name} (${coin.symbol.toUpperCase()})`}
                    description={`Price: $${coin.current_price} | Market Cap: $${coin.market_cap.toLocaleString()}`}
                  />
                </List.Item>
              )}
            />
          )}
        </Panel>

        <Panel header="Crypto Converter" key="converter" extra={<Switch checked={enabledFeatures.exchangeComparisons} onChange={() => toggleFeature('exchangeComparisons')} />}>
          {enabledFeatures.exchangeComparisons && (
            <Card className="crypto-converter">
              <Row gutter={16} align="middle">
                <Col span={8}><InputNumber min={1} value={amount} onChange={setAmount} /></Col>
                <Col span={8}>
                  <Select value={fromCoin} onChange={setFromCoin} style={{ width: '100%' }}>
                    {coinsList.map(coin => (<Option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</Option>))}
                  </Select>
                </Col>
                <Col span={8}>
                  <Select value={toCoin} onChange={setToCoin} style={{ width: '100%' }}>
                    {coinsList.map(coin => (<Option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</Option>))}
                  </Select>
                </Col>
              </Row>
              <Title level={4} style={{ marginTop: '10px' }}>{amount} {fromCoin.toUpperCase()} = {convertedAmount ? convertedAmount.toFixed(6) : '...'} {toCoin.toUpperCase()}</Title>
            </Card>
          )}
        </Panel>

        <Panel header="Crypto Event Calendar" key="cryptoEvents" extra={<Switch checked={enabledFeatures.cryptoEvents} onChange={() => toggleFeature('cryptoEvents')} />}>
          {enabledFeatures.cryptoEvents && (
            <>
              <List
                itemLayout="horizontal"
                dataSource={cryptoEvents}
                renderItem={event => (
                  <List.Item actions={[<Button type="link" danger onClick={() => deleteEvent(event.id)}>Delete</Button>]}> 
                    <List.Item.Meta title={event.title} description={`Date: ${event.date} | Location: ${event.country}`} />
                  </List.Item>
                )}
              />
              <Form layout="inline" style={{ marginTop: '10px' }}>
                <Form.Item>
                  <Input placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                </Form.Item>
                <Form.Item>
                  <Input placeholder="Date" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                </Form.Item>
                <Form.Item>
                  <Input placeholder="Location" value={newEvent.country} onChange={(e) => setNewEvent({ ...newEvent, country: e.target.value })} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={addEvent}>Add Event</Button>
                </Form.Item>
              </Form>
            </>
          )}
        </Panel>
      </Collapse>

      
      <Collapse accordion>
        <Panel header="Market Sentiment" key="marketSentiment" extra={<Switch checked={enabledFeatures.marketSentiment} onChange={() => toggleFeature('marketSentiment')} />}>
          {enabledFeatures.marketSentiment && fearGreedIndex && (
            <Card>
              <Title level={4}>Fear and Greed Index</Title>
              <p>Current Sentiment: <strong>{fearGreedIndex.value_classification}</strong></p>
              <p>Index Value: {fearGreedIndex.value}</p>
            </Card>
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default Features;
