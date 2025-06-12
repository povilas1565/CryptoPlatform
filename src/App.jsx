import React from 'react';
import { Layout, Typography, Space } from 'antd';
import { Link, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Homepage from './components/Homepage';
import News from './components/News';
import CryptoDetails from './components/CryptoDetails';
import Exchanges from './components/Exchanges';
import Cryptocurrencies from './components/Cryptocurrencies';
import './App.css';
import Features from './components/Features';

function App() {
  return (
    <div className='App'>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='main'>
        <Layout>
          <Layout.Content className='routes'>
            <Routes>
              <Route exact path="/" element={<Homepage />} />
              <Route exact path='/exchanges' element={<Exchanges />} />
              <Route exact path='/cryptocurrencies' element={<Cryptocurrencies />} />
              <Route exact path='/crypto/:coinId' element={<CryptoDetails />} />
              <Route exact path='/news' element={<News />} />
              <Route exact path='/features' element={<Features/>}/>
            </Routes>
          </Layout.Content>
        </Layout>
      </div>
      <div className='footer'>
        <Typography.Title level={5} style={{ color: 'white', textAlign: 'center' }}>
          CryptoAnalysisPlatform <br />
          All rights reserved © 2023
        </Typography.Title>
        <Space>
          <Link to="/">Home</Link>
          <Link to="/exchanges">Exchanges</Link>
          <Link to="/news">News</Link>
        </Space>
      </div>
    </div>
  );
}

export default App;
