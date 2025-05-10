import { faShoppingBag, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "../ui/Skeleton";

export default function RecommendedItems({ collectionId }) {
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionId) return;

    const fetchRecommendedItems = async () => {
      try {
        const response = await fetch(
          `https://remote-internship-api-production.up.railway.app/collection/${collectionId}`
        );
        const data = await response.json();
        if (data.status === "success") {
          setRecommendedItems(data.data.items.slice(0, 10)); // Get the first 10 items
        } else {
          console.error("No items found for this collection.");
        }
      } catch (error) {
        console.error("Error fetching recommended items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedItems();
  }, [collectionId]);

  const renderSkeletonSlide = (_, index) => (
    <SwiperSlide key={`skeleton-${index}`}>
      <div className="item">
        <Skeleton width="300px" height="300px" borderRadius="12px" />
        <div className="item__details">
          <Skeleton width="80%" height="20px" borderRadius="6px" />
          <Skeleton width="60%" height="16px" borderRadius="6px" />
          <Skeleton width="80%" height="16px" borderRadius="6px" />
        </div>
      </div>
    </SwiperSlide>
  );

  if (loading) {
    return (
      <section id="recommended-items">
        <div className="container">
          <Swiper
            modules={[Navigation]}
            loop={true}
            navigation={true}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {Array.from({ length: 6 }).map(renderSkeletonSlide)}
          </Swiper>
        </div>
      </section>
    );
  }

  return (
    <section id="recommended-items">
      <div className="container">
        <div className="row">
          <h2 className="recommended-items__title">More from this collection</h2>
          <Swiper
            modules={[Navigation]}
            loop={true}
            navigation={true}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {recommendedItems.map((item) => (
              <SwiperSlide key={item.itemId}>
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
                    <span className="item__details__price">{item.price} ETH</span>
                    <span className="item__details__last-sale">
                      Last sale: {item.lastSale} ETH
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="recommended-items__footer">
              <Link
                to={`/collection/${collectionId}`}
                className="recommended-items__footer__button"
              >
                View Collection
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
}