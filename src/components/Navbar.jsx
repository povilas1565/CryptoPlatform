import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined, ExperimentOutlined } from '@ant-design/icons';
import icon from '../Images/cryptocurrency.png';

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const menuItems = [
    { label: <Link to="/">Home</Link>, icon: <HomeOutlined />, key: 'home' },
    { label: <Link to="/cryptocurrencies">Cryptocurrencies</Link>, icon: <FundOutlined />, key: 'cryptocurrencies' },
    { label: <Link to="/exchanges">Exchanges</Link>, icon: <MoneyCollectOutlined />, key: 'exchanges' },
    { label: <Link to="/news">News</Link>, icon: <BulbOutlined />, key: 'news' },
    { label: <Link to="/features">Features</Link>, icon: <ExperimentOutlined />, key: 'features' }
  ];

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size="large" />
        <Typography.Title level={3} className="logo"><Link to="/">CryptoPlatform</Link></Typography.Title>
        <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}><MenuOutlined /></Button>
      </div>
      {activeMenu && (
        <Menu theme="dark" items={menuItems} />
      )}
    </div>
  );
};

export default Navbar;
