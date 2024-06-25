import axios from "axios";
import React, { useEffect, useState } from "react";
import rating from "../../assets/rating.svg";
import "./Card.css";
import { MdShoppingCart } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { CARD_IMG } from "../../static";
import { Link } from "react-router-dom";

const API_URL = "https://dummyjson.com/products";
const Card = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5;
  const maxPageNumbersToShow = 5;

  useEffect(() => {
    axios
      .get(`${API_URL}?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`)
      .then((res) => {
        setData(res.data.products);
        setTotalPages(Math.ceil(res.data.total / itemsPerPage));
      })
      .catch((err) => console.log(err));
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const halfMaxPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);
    let startPage = Math.max(currentPage - halfMaxPageNumbersToShow, 1);
    let endPage = startPage + maxPageNumbersToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="products-wrapper">
        {data?.map((el) => (
          <div key={el.id} className="card">
            <div className="card-img">
              <Link to={`/products/${el.id}`}>
                {CARD_IMG[el.id] ? (
                  <img src={CARD_IMG[el.id]?.img} alt="" />
                ) : (
                  <img src={el.images[0]} alt="" />
                )}
              </Link>
              <div className="card-hover">
                <MdShoppingCart className="card-cart" />
                <FaHeart className="card-heart" />
              </div>
            </div>
            <div className="card-info">
              <h1>{el.title}</h1>
              <img src={rating} alt="" />
              <div className="card-price">
                <h4>${el.price * 2}</h4>
                <h3>${el.price}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={currentPage === pageNumber ? "active" : ""}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Card;
