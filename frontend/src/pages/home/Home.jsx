import React, { useMemo, useRef } from "react";
import Landing from "../../components/homepage/Landing";
import OurPolicy from "../../components/homepage/OurPolicy";
import CategoryExpressions from "../../components/home/CategoryExpressions";
import CampaignAdBanner from "../../components/campaigns/CampaignAdBanner";
import TrendingProducts from "../../components/home/TrendingProducts";
import IndoWesternFeature from "../../components/home/IndoWesternFeature";
import TextileExperience from "../../components/home/TextileExperience";
import OccasionEdit from "../../components/home/OccasionEdit";
import PrintedTeesFeature from "../../components/home/PrintedTeesFeature";
import StoreStory from "../../components/home/StoreStory";
import NewsletterBox from "../../components/homepage/NewsletterBox";
import useReducedMotion from "../../components/motion/useReducedMotion";
import useReveal from "../../components/motion/useReveal";
import useStore from "../../store/store";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  useSeoMeta,
} from "../../utils/seo";

const Home = () => {
  const homeRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const siteLoaded = useStore((s) => s.siteLoaded);
  const settings = useStore((s) => s.settings);

  useReveal(homeRef, reducedMotion, siteLoaded || reducedMotion);

  const homeJsonLd = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return [buildOrganizationSchema(origin, settings), buildWebSiteSchema(origin)];
  }, [settings]);

  useSeoMeta({
    title: "Weaving Life Into Time · Sarees, Lehengas & Indian Textiles",
    description:
      "Shop Revakalp Indore — curated Indian handloom sarees (Maheshwari, Banarasi, Chanderi, Kanjivaram, Paithani), bridal lehengas, Indo-Western wear, and printed tees.",
    canonicalPath: "/",
    ogImage: "/branding/social/revakalp-open-graph-1200x630.png",
    jsonLd: homeJsonLd,
  });

  return (
    <div ref={homeRef}>
      <Landing />
      <OurPolicy />
      <CategoryExpressions />
      <CampaignAdBanner slot="promo_banner" />
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
