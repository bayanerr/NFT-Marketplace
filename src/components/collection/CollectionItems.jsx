import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function CollectionItems() {
  const { collectionId } = useParams();
  const [collectionData, setCollectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState(""); // "" | "high" | "low"

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

  const { items = [] } = collectionData;

  const sortedItems = [...items].sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);
    if (sortOrder === "high") return priceB - priceA;
    if (sortOrder === "low") return priceA - priceB;
    return 0; // Default, no sorting
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setVisibleCount(12); // Optional: Reset to first 12 after sort change
  };

  return (
    <section id="collection-items">
      <div className="row collection-items__row">
        <div className="collection-items__header">
          <div className="collection-items__header__left">
            <span className="collection-items__header__live">
              <div className="green-pulse"></div>
              Live
            </span>
            <span className="collection-items__header__results">
              {items.length} results
            </span>
          </div>
          <select
            className="collection-items__header__sort"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="">Default</option>
            <option value="high">Price high to low</option>
            <option value="low">Price low to high</option>
          </select>
        </div>

        <div className="collection-items__body">
          {visibleItems.map((item) => (
            <div className="item-column" key={item.itemId}>
              <Link to={`/item/${item.itemId}`} className="item">
                <figure className="item__img__wrapper">
                  <img
                    src={item.imageLink}
                    alt={item.title}
                    className="item__img"
                  />
                </figure>
                <div className="item__details">
                  <span className="item__details__name">{item.title}</span>
                  <span className="item__details__price">
                    {item.price} ETH
                  </span>
                  <span className="item__details__last-sale">
                    Last sale: {item.lastSale} ETH
                  </span>
                </div>
                <div className="item__see-more">
                  <button className="item__see-more__button">See More</button>
                  <div className="item__see-more__icon">
                    <FontAwesomeIcon icon={faShoppingBag} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {visibleCount < sortedItems.length && (
        <button className="collection-page__button" onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </section>
  );
}