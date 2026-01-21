import React from 'react';
import Landing from '../../components/homepage/Landing';
import BestSeller from '../../components/homepage/BestSeller';
import LatestCollection from '../../components/homepage/LatestCollection';
import NewsletterBox from '../../components/homepage/NewsletterBox';
import OurPolicy from '../../components/homepage/OurPolicy';

const Home = () => {
  return (
    <div>
      <Landing />
      <BestSeller />
      <LatestCollection />
      <NewsletterBox />
      <OurPolicy />
    </div>
  );
};

export default Home;
