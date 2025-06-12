import React, { useState, useEffect, useRef } from 'react';
import { Typography, Row, Col, Avatar, Card } from 'antd';
import moment from 'moment';

import Loader from './Loader';

const { Text, Title } = Typography;
const demoImage = 'https://rb.gy/b0cq5c';

const News = ({ simplified, topOnly }) => {
  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
        const data = await response.json();
        let articles = data.Data;
  
        if (topOnly) {
          setNewsList(articles.slice(0, 5)); // Only show 10 news articles on homepage
        } else {
          setNewsList((prevNews) => (page === 1 ? articles : [...prevNews, ...articles]));
        }
      } catch (error) {
        console.error('Error fetching crypto news:', error);
      }
      setLoading(false);
    };
  
    fetchNews();
  }, [page, topOnly]);
  

  const lastNewsElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // Load more news when scrolling
      }
    });
    if (node) observer.current.observe(node);
  };

  if (loading && newsList.length === 0) return <Loader />;

  return (
   <>
   <Title>Top News</Title>
    <Row gutter={[24, 24]}>
      {newsList.map((news, index) => (
        <Col
          xs={24}
          sm={12}
          lg={8}
          key={news.id || index}
          ref={index === newsList.length - 1 ? lastNewsElementRef : null}
        >
          
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <img src={news.imageurl || demoImage} alt="News Thumbnail" />
                <Title className="news-title" level={4}>{news.title}</Title>
              </div>
              <p>{news.body.length > 100 ? `${news.body.substring(0, 100)}...` : news.body}</p>
              <div className="provider-container">
                <div>
                  <Avatar src={news.source_info.img || demoImage} alt="Provider" />
                  <Text className="provider-name">{news.source_info.name}</Text>
                </div>
                <Text>{moment.unix(news.published_on).fromNow()}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
      {loading && <Loader />}
    </Row>
    </>
  );
};

export default News;
