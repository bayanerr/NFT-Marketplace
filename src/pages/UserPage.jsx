import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function UserPage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState(""); // '', 'asc', or 'desc'

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://remote-internship-api-production.up.railway.app/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setUserData(data.data);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  const {
    imageLink,
    profilePicture,
    walletCode,
    creationDate,
    name,
    items,
  } = userData;

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setVisibleCount(12); // reset to first 12 when sorting changes
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    if (sortOrder === "desc") return b.price - a.price;
    return 0; // default: no sort
  });

  const visibleItems = sortedItems.slice(0, visibleCount);

  return (
    <>
      <header
        style={{ backgroundImage: `url('${imageLink}')` }}
        id="user-header"
      ></header>

      <section id="user-info">
        <div className="row">
          <div className="user-info__wrapper">
            <figure className="user-info__img__wrapper">
              <img
                src={profilePicture}
                alt={name}
                className="user-info__img"
              />
            </figure>
            <h1 className="user-info__name">{name}</h1>
            <div className="user-info__details">
              <span className="user-info__wallet">
                <FontAwesomeIcon
                  icon={faEthereum}
                  className="user-info__wallet__icon"
                />
                <span className="user-info__wallet__data">{walletCode}</span>
              </span>
              <span className="user-info__year">
                <span className="user-info__year__data">
                  Joined {creationDate}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="user-items">
        <div className="row user-items__row">
          <div className="user-items__header">
            <div className="user-items__header__left">
              <span className="user-items__header__text">
                {items.length} items
              </span>
            </div>
            <select className="user-items__header__sort" onChange={handleSortChange}>
              <option value="">Recently purchased</option>
              <option value="desc">Price high to low</option>
              <option value="asc">Price low to high</option>
            </select>
          </div>

          <div className="user-items__body">
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

        {visibleCount < sortedItems.length && (
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