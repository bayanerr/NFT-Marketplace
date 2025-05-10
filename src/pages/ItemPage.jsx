import { faEye, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faShapes,
  faTag,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import RecommendedItems from "../components/item/RecommendedItems";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { Link, useParams } from "react-router-dom";

export default function ItemPage() {
  const { itemId } = useParams();
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!itemId) return;

    const fetchCollectionData = async () => {
      try {
        const response = await fetch(
          `https://remote-internship-api-production.up.railway.app/item/${itemId}`
        );
        const data = await response.json();
        if (data.status === "success") {
          setItemData(data.data);
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
  }, [itemId]);

  if (loading) return <div>Loading collection...</div>;
  if (!itemData) return <div>No data found for this collection.</div>;

  const {
    title,
    views,
    category,
    imageLink,
    usdPrice,
    ethPrice,
    favorites,
    collection,
    owner,
    ownerId,
    collectionId,
  } = itemData;

  return (
    <>
      <section id="item-info">
        <div className="container">
          <div className="row item-page__row">
            <div className="item-page__left">
              <figure className="item-page__img__wrapper">
                <div className="item-page__img__details">
                  <FontAwesomeIcon
                    icon={faEthereum}
                    className="item-page__img__icon"
                  />
                  <div className="item-page__img__likes">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="item-page__img__icon"
                    />
                    <span className="item-page__img__likes__text">
                      {favorites}
                    </span>
                  </div>
                </div>
                <img
                  src={imageLink}
                  alt={title}
                  className="item-page__img"
                />
              </figure>
            </div>
            <div className="item-page__right">
              <Link
                to={`/collection/${collection}`}
                className="item-page__collection light-blue"
              >
                {collection} {category}
              </Link>
              <h1 className="item-page__name">
                {category} {title}
              </h1>
              <span className="item-page__owner">
                Owned by{" "}
                <Link
                  to={`/user/${ownerId}`}
                  className="light-blue item-page__owner__link"
                >
                  {owner}
                </Link>
              </span>
              <div className="item-page__details">
                <div className="item-page__detail">
                  <FontAwesomeIcon
                    icon={faEye}
                    className="item-page__detail__icon"
                  />
                  <span className="item-page__detail__text">{views} views</span>
                </div>
                <div className="item-page__detail">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="item-page__detail__icon"
                  />
                  <span className="item-page__detail__text">
                    {favorites} favorites
                  </span>
                </div>
                <div className="item-page__detail">
                  <FontAwesomeIcon
                    icon={faShapes}
                    className="item-page__detail__icon"
                  />
                  <span className="item-page__detail__text">{category}</span>
                </div>
              </div>
              <div className="item-page__sale">
                <div className="item-page__sale__header">
                  <div className="green-pulse"></div>
                  <span>Sale ends in 2h 30m 56s</span>
                  {/* Consider calculating this from `expiryDate` if needed */}
                </div>
                <div className="item-page__sale__body">
                  <span className="item-page__sale__label">Current price</span>
                  <div className="item-page__sale__price">
                    <span className="item-page__sale__price__eth">
                      {ethPrice} ETH
                    </span>
                    <span className="item-page__sale__price__dollars">
                      {usdPrice}
                    </span>
                  </div>
                  <div className="item-page__sale__buttons">
                    <div className="item-page__sale__buy">
                      <button className="item-page__sale__buy__button disabled">
                        Buy now
                      </button>
                      <button className="item-page__sale__buy__icon disabled">
                        <FontAwesomeIcon icon={faShoppingBag} />
                      </button>
                    </div>
                    <button className="item-page__sale__offer disabled">
                      <FontAwesomeIcon icon={faTag} />
                      Make offer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecommendedItems collectionId={collectionId}/>
    </>
  );
}
