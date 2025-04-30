import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "../ui/Skeleton";

export default function NewCollections() {
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    fetch("https://remote-internship-api-production.up.railway.app/newCollections")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setCollections(data.data.slice(0, 9)); // Get the first 9
        }
      })
      .catch((error) => {
        console.error("Error fetching collections:", error);
      });
  }, []);

   const renderSkeletonSlide = (_, index) => (
    <SwiperSlide key={`skeleton-${index}`}>
      <div className="collection">
        <Skeleton width="400px" height="200px" borderRadius="12px" />
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
    </SwiperSlide>
  );
  return (
    <section id="new-collections">
      <div className="container">
        <div className="row">
          <h2 className="new-collections__title">New Collections</h2>
          <div className="new-collections__body" style={{ minHeight: "250px" }}>
            <Swiper
              modules={[Navigation]}
              loop={true}
              navigation={true}
              allowTouchMove={false}
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: 1 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
                1536: { slidesPerView: 6 },
              }}
            >
              {collections.length === 0
                ? Array.from({ length: 6 }).map(renderSkeletonSlide)
                : collections.map((collection) => (
                    <SwiperSlide key={collection.collectionId}>
                      <Link to={`/collection/${collection.collectionId}`} className="collection">
                        <img
                          src={collection.imageLink}
                          alt={collection.title}
                          className="collection__img"
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                        <div className="collection__info">
                          <h3 className="collection__name">{collection.title}</h3>
                          <div className="collection__stats">
                            <div className="collection__stat">
                              <span className="collection__stat__label">Floor</span>
                              <span className="collection__stat__data">{collection.floor} ETH</span>
                            </div>
                            <div className="collection__stat">
                              <span className="collection__stat__label">Total Volume</span>
                              <span className="collection__stat__data">{collection.totalVolume} ETH</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  ); 
}