import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../ui/Skeleton";
export default function SelectedCollection() {
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCollection() {
      try {
        const response = await fetch("https://remote-internship-api-production.up.railway.app/selectedCollection");
        const result = await response.json();

        if (result.status === "success") {
          setCollection(result.data);
        } else {
          setError(result.message || "Failed to load collection");
        }
      } catch (err) {
        setError("Failed to fetch collection");
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, []);

  if (loading) {
    return (
      <header>
        <div className="selected-collection">
          <Skeleton width="100%" height="100%" borderRadius="0px" />
        </div>
      </header>
    );
  }
  if (error) return <div>{error}</div>;
  if (!collection) return null;

  return (
    <header>
      <div className="selected-collection">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={collection.thumbnail}
          src={collection.videoLink}
          className="selected-collection__bg"
        />
        <div className="selected-collection__description">
          <img
            src={collection.logo}
            alt="Collection Logo"
            className="selected-collection__logo"
          />
          <h1 className="selected-collection__title">
            {collection.title}
          </h1>
          <Link to={`/user/${collection.creatorId}`} className="selected-collection__author">
            By {collection.creator}
            <img
              src="/src/assets/verified.png"
              alt="Verified"
              className="selected-collection__author__verified"
            />
          </Link>
          <div className="selected-collection__details">
            {collection.amountOfItems} items · {collection.floorPrice} ETH
          </div>
          <Link to={`/collection/${collection.collectionId}`} className="selected-collection__button">
            <div className="green-pulse"></div>
            View Collection
          </Link>
        </div>
      </div>
    </header>
  );
}