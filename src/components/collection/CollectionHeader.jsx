import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton
 from "../ui/Skeleton";
export default function CollectionHeader() {
  const { collectionId } = useParams();
  const [collectionData, setCollectionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionId) return;

    const fetchCollectionData = async () => {
      try {
        const response = await fetch(
          `https://remote-internship-api-production.up.railway.app/collection/${collectionId}`
        );
        const data = await response.json();
        if (data.status === "success") {
          setCollectionData(data.data);
        } else {
          console.error("Collection data not found.");
        }
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionId]);

  if (loading) {
    return (
      <header id="collection-header">
          <Skeleton width="100%" height="100%" borderRadius="0px" />
      </header>
    );
  }
  if (!collectionData) return <div>No data found for this collection.</div>;

  const {
    imageLink: profileImage,
    title: name,
    creator: author,
    creatorId,
    totalVolume,
    floor,
    bestOffer,
    listed,
    owners,
    logo,
  } = collectionData;

  return (
    <header
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.2)), url('${profileImage}')`,
      }}
      id="collection-header"
    >
      <div className="row collection-header__row">
        <div className="collection-header__content">
          <div className="collection-header__left">
            <img
              src={logo}
              alt={`${name} logo`}
              className="collection-header__img"
            />
            <div className="collection-header__name">{name}</div>
            <Link to={`/user/${creatorId}`} className="collection-header__author">
              {author}
            </Link>
          </div>
          <div className="collection-header__right">
            <div className="collection-header__columns">
              <div className="collection-header__column">
                <span className="collection-header__column__data">
                  <span className="semibold">{totalVolume}</span> ETH
                </span>
                <span className="collection-header__column__label">
                  Total Volume
                </span>
              </div>
              <div className="collection-header__column">
                <span className="collection-header__column__data">
                  <span className="semibold">{floor}</span> ETH
                </span>
                <span className="collection-header__column__label">
                  Floor Price
                </span>
              </div>
              <div className="collection-header__column">
                <span className="collection-header__column__data">
                  <span className="semibold">{bestOffer}</span> ETH
                </span>
                <span className="collection-header__column__label">
                  Best Offer
                </span>
              </div>
              <div className="collection-header__column">
                <span className="collection-header__column__data">
                  <span className="semibold">{listed}</span>%
                </span>
                <span className="collection-header__column__label">Listed</span>
              </div>
              <div className="collection-header__column">
                <span className="collection-header__column__data">
                  <span className="semibold">{owners}</span>
                </span>
                <span className="collection-header__column__label">
                  Owners (Unique)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}