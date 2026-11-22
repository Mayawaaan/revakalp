import React, { useRef } from "react";
import Landing from "../../components/homepage/Landing";
import OurPolicy from "../../components/homepage/OurPolicy";
import CategoryExpressions from "../../components/home/CategoryExpressions";
import TrendingProducts from "../../components/home/TrendingProducts";
import IndoWesternFeature from "../../components/home/IndoWesternFeature";
import TextileExperience from "../../components/home/TextileExperience";
import OccasionEdit from "../../components/home/OccasionEdit";
import PrintedTeesFeature from "../../components/home/PrintedTeesFeature";
import StoreStory from "../../components/home/StoreStory";
import NewsletterBox from "../../components/homepage/NewsletterBox";
import useReducedMotion from "../../components/motion/useReducedMotion";
import useReveal from "../../components/motion/useReveal";

const Home = () => {
  const homeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useReveal(homeRef, reducedMotion);

  return (
    <div ref={homeRef}>
      <Landing />
      <OurPolicy />
      <CategoryExpressions />
      <TrendingProducts />
      <IndoWesternFeature />
      <TextileExperience />
      <OccasionEdit />
      <PrintedTeesFeature />
      <StoreStory />
      <NewsletterBox />
    </div>
  );
};

export default Home;
