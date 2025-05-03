import React, { useState, useEffect } from "react";
import SelectedCollection from "../components/home/SelectedCollection";
import { Link } from "react-router-dom";
import Skeleton from "../components/ui/Skeleton";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://remote-internship-api-production.up.railway.app/collections")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setCollections(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching collections:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6);
  };

  const visibleCollections = collections.slice(0, visibleCount);

  return (
    <div className="container">
      <div className="row">
        <h1 className="collections-page__title">Collections</h1>
        <div className="collections__body">
          {loading
            ? new Array(12).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="collection-column">
                  <div className="collection">
                    <Skeleton width="100%" height="200px" borderRadius="12px" />
                    <div className="collection__info">
                      <Skeleton width="80%" height="20px" borderRadius="6px" />
                      <div className="collection__stats">
                        <div className="collection__stat">
                          <Skeleton width="60px" height="14px" borderRadius="4px" />
                          <Skeleton width="80px" height="16px" borderRadius="4px" />
                        </div>
                        <div className="collection__stat">
                          <Skeleton width="80px" height="14px" borderRadius="4px" />
                          <Skeleton width="100px" height="16px" borderRadius="4px" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : visibleCollections.map((collection) => (
                <div key={collection.id} className="collection-column">
                  <Link to={`/collection/${collection.id}`} className="collection">
                    <img
                      src={collection.logo || "default-image.jpg"}
                      alt={collection.title}
                      className="collection__img"
                    />
                    <div className="collection__info">
                      <h3 className="collection__name">{collection.title}</h3>
                      <div className="collection__stats">
                        <div className="collection__stat">
                          <span className="collection__stat__label">Floor</span>
                          <span className="collection__stat__data">
                            {collection.floor} ETH
                          </span>
                        </div>
                        <div className="collection__stat">
                          <span className="collection__stat__label">Total Volume</span>
                          <span className="collection__stat__data">
                            {collection.totalVolume} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
        </div>

        {!loading && visibleCount < collections.length && (
          <button className="collections-page__button" onClick={handleLoadMore}>
            Load more
          </button>
        )}
      </div>
    </div>
  );
}