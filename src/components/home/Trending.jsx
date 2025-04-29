import React, { useState, useEffect } from "react";
import VerifiedIcon from "../../assets/verified.png";
import { Link } from "react-router-dom";
import Skeleton from "../ui/Skeleton";

export default function Trending() {
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingData() {
      try {
        const response = await fetch("https://remote-internship-api-production.up.railway.app/trendingNFTs");
        const data = await response.json();
        setTrendingData(data.data);
      } catch (error) {
        console.error("Error fetching trending data: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrendingData();
  }, []);

  const midIndex = Math.ceil(trendingData.length / 2);
  const firstColumnData = trendingData.slice(0, midIndex);
  const secondColumnData = trendingData.slice(midIndex);

  const renderTrendingItem = (collection, index) => (
    <Link
      to={`/collection/${collection.collectionId}`}
      key={collection.collectionId}
      className="trending-collection"
    >
      <div className="trending-collection__rank">{collection.rank}</div>
      <div className="trending-collection__collection">
        <figure className="trending-collection__img__wrapper">
          <img
            src={collection.imageLink}
            alt={collection.title}
            className="trending-collection__img"
          />
        </figure>
        <div className="trending-collection__name">{collection.title}</div>
        <img
          src={VerifiedIcon}
          alt="Verified"
          className="trending-collection__verified"
        />
      </div>
      <div className="trending-collection__price">
        <span className="trending-collection__price__span">{collection.floor} ETH</span>
      </div>
      <div className="trending-collection__volume">
        <span className="trending-collection__volume__span">{collection.totalVolume} ETH</span>
      </div>
    </Link>
  );

  const renderSkeletonItem = (rank) => (
    <div className="trending-collection" key={rank}>
      <div className="trending-collection__rank">
        {rank}
      </div>
      <div className="trending-collection__collection">
        <figure className="trending-collection__img__wrapper">
          <Skeleton width="100%" height="100%" borderRadius="0px" />
        </figure>
        <div className="trending-collection__name">
          <Skeleton width="200px" height="30px" borderRadius="0px" />
        </div>
      </div>
      <div className="trending-collection__price">
        <Skeleton width="100px" height="30px" borderRadius="0px" />
      </div>
      <div className="trending-collection__volume">
        <Skeleton width="100px" height="30px" borderRadius="0px" />
      </div>
    </div>
  );

  return (
    <section id="trending">
      <div className="container">
        <div className="row trending__row">
          <div className="trending__header">
            <h2 className="trending__header__title">Trending NFTs</h2>
            <Link className="trending__header__button" to={"/collections"}>
              View All
            </Link>
          </div>
          <div className="trending__body">
            {/* First Column */}
            <div className="trending-column">
              <div className="trending-column__header">
                <div className="trending-column__header__rank">#</div>
                <div className="trending-column__header__collection">Collection</div>
                <div className="trending-column__header__price">Floor Price</div>
                <div className="trending-column__header__price">Volume</div>
              </div>
              <div className="trending-column__body">
                {loading
                  ? Array.from({ length: 5 }, (_, i) => renderSkeletonItem(i + 1)) // Ranks 1-5
                  : firstColumnData.map((item, index) => renderTrendingItem(item, index))}
              </div>
            </div>

            {/* Second Column */}
            <div className="trending-column">
              <div className="trending-column__header trending-column__header2">
                <div className="trending-column__header__rank">#</div>
                <div className="trending-column__header__collection">Collection</div>
                <div className="trending-column__header__price">Floor Price</div>
                <div className="trending-column__header__price">Volume</div>
              </div>
              <div className="trending-column__body">
                {loading
                  ? Array.from({ length: 5 }, (_, i) => renderSkeletonItem(i + 6)) // Ranks 6-10
                  : secondColumnData.map((item, index) => renderTrendingItem(item, index + 5))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}