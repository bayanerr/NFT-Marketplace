import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "../components/ui/Skeleton";
export default function UserPage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`https://remote-internship-api-production.up.railway.app/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setUserData(data.data);
      })
      .catch((err) => console.error("Error fetching user data:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setVisibleCount(12);
  };

  const sortedItems = [...(userData?.items || [])].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0;
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  return (
    <>
      <header
        style={{ backgroundImage: userData ? `url('${userData.imageLink}')` : "none" }}
        id="user-header"
      >
        {!userData && (
          <Skeleton width="100%" height="300px" borderRadius="0px" />
        )}
      </header>

      <section id="user-info">
        <div className="row">
          <div className="user-info__wrapper">
            {loading ? (
              <>
                <Skeleton width="150px" height="150px" borderRadius="50%" />
                <Skeleton width="200px" height="36px" borderRadius="6px" style={{ marginTop: "1rem" }} />
                <Skeleton width="250px" height="24px" borderRadius="6px" style={{ marginTop: "0.5rem" }} />
              </>
            ) : (
              <>
                <figure className="user-info__img__wrapper">
                  <img
                    src={userData.profilePicture}
                    alt={userData.name}
                    className="user-info__img"
                  />
                </figure>
                <h1 className="user-info__name">{userData.name}</h1>
                <div className="user-info__details">
                  <span className="user-info__wallet">
                    <FontAwesomeIcon
                      icon={faEthereum}
                      className="user-info__wallet__icon"
                    />
                    <span className="user-info__wallet__data">{userData.walletCode}</span>
                  </span>
                  <span className="user-info__year">
                    <span className="user-info__year__data">
                      Joined {userData.creationDate}
                    </span>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="user-items">
        <div className="row user-items__row">
          <div className="user-items__header">
            <div className="user-items__header__left">
              <span className="user-items__header__text">
                {loading ? <Skeleton width="80px" height="20px" /> : `${sortedItems.length} items`}
              </span>
            </div>
            <select
              className="user-items__header__sort"
              onChange={handleSortChange}
              disabled={loading}
              value={sortOrder}
            >
              <option value="">Recently purchased</option>
              <option value="desc">Price high to low</option>
              <option value="asc">Price low to high</option>
            </select>
          </div>

          <div className="user-items__body">
            {loading
              ? new Array(12).fill(0).map((_, index) => (
                  <div className="item-column" key={`skeleton-${index}`}>
                    <div className="item">
                      <Skeleton width="100%" height="200px" borderRadius="12px" />
                      <div className="item__details">
                        <Skeleton width="60%" height="20px" borderRadius="6px" />
                        <Skeleton width="40%" height="18px" borderRadius="4px" />
                        <Skeleton width="50%" height="16px" borderRadius="4px" />
                      </div>
                      <div className="item__see-more">
                        <Skeleton width="100px" height="36px" borderRadius="20px" />
                      </div>
                    </div>
                  </div>
                ))
              : visibleItems.map((item) => (
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
                        <span className="item__details__price">{item.price} ETH</span>
                        <span className="item__details__last-sale">
                          Last sale: {item.lastSale} ETH
                        </span>
                      </div>
                      <a className="item__see-more" href="#">
                        <button className="item__see-more__button">See More</button>
                        <div className="item__see-more__icon">
                          <FontAwesomeIcon icon={faShoppingBag} />
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
          </div>
        </div>

        {!loading && visibleCount < sortedItems.length && (
          <button
            className="collection-page__button"
            onClick={() => setVisibleCount((prev) => prev + 6)}
          >
            Load more
          </button>
        )}
      </section>
    </>
  );
}