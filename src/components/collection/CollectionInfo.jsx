import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function CollectionInfo() {
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

  if (loading) return <div>Loading collection...</div>;
  if (!collectionData) return <div>No data found for this collection.</div>;

  const {
    description,
    createdDate,
    creatorEarnings,
    chain,
    items = [],
  } = collectionData;
  return (
    <section id="collection-info">
      <div className="row">
        <div className="collection-info__wrapper">
          <p className="collection-info__description">
            {description}
          </p>
          <div className="collection-info__details">
            <span className="collection-info__detail">
              Items
              <span className="collection-info__detail__data"> {items.length} </span>
            </span>
            ·
            <span className="collection-info__detail">
              Created
              <span className="collection-info__detail__data"> {createdDate} </span>
            </span>
            ·
            <span className="collection-info__detail">
              Creator earnings
              <span className="collection-info__detail__data"> {creatorEarnings} </span>
            </span>
            ·
            <span className="collection-info__detail">
              Chain
              <span className="collection-info__detail__data"> {chain} </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
