import React, { useState, useEffect, useRef } from "react";
import "../CollegeTable.css";
import colleges from "../constant/colleges.json";

import { IoIosArrowDown } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { HiOutlineDownload } from "react-icons/hi";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { HiMiniArrowsRightLeft } from "react-icons/hi2";
import { TiStarburst } from "react-icons/ti";
import { IoCheckmark } from "react-icons/io5";
import filterData from "./filter";
import { debounce } from "./searching";

const CollegeTable = () => {
  const [data, setData] = useState(colleges.slice(0, 10));
  const [collegeName, setCollegeName] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef(null);

  const sortData = (property) => {
    filterData(property, setData, data, sortDirection);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const debouncedSearch = debounce((searchTerm) => {
    const filteredColleges = colleges.filter((college) =>
      college.name.toLowerCase().includes(searchTerm)
    );

    setData(
      searchTerm.length !== 0
        ? filteredColleges
        : colleges.slice(0, (page + 1) * 10)
    );
  }, 500);

  const searchCollege = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setCollegeName(searchTerm);
    debouncedSearch(searchTerm);
  };

  const fetchMoreData = () => {
    const newData = colleges.slice(page * 10, (page + 1) * 10);
    if (newData.length > 0) {
      setPage((prevPage) => prevPage + 1);
      setData((prevData) => [...prevData, ...newData]);
    }
  };

  useEffect(() => {
    const currentRef = loadMoreRef.current;
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && data.length < colleges.length) {
        fetchMoreData();
      }
    });

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [page, data]);

  return (
    <>
      <div className="mt-5">
        <input
          type="text"
          placeholder="Type College Name"
          className="border border-gray-300 w-96 p-2 rounded-full text-sm outline-none"
          onChange={searchCollege}
          value={collegeName}
        />
      </div>
      <div className="table-container">
        <table className="college-table">
          <thead className="text-white text-sm cursor-pointer">
            <tr>
              <th onClick={() => sortData("collegeduniaRank")}>CD Rank</th>
              <th>Colleges</th>
              <th onClick={() => sortData("fees")}>Course Fees</th>
              <th>Placement</th>
              <th onClick={() => sortData("userReviewRating")}>User Reviews</th>
              <th onClick={() => sortData("ranking")}>Ranking</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((college, idx) => (
                <tr key={idx} className={college.featured ? "featured" : ""}>
                  <td>
                    <div className="rank-block ml-2">
                      #{college.collegeduniaRank}
                    </div>
                  </td>
                  <td>
                    {college.featured && (
                      <div className="ribbon">
                        <span className="ribbon1">
                          <span className="text-xs">Featured</span>
                        </span>
                      </div>
                    )}
                    <div className="college-info">
                      <img
                        src="./images/iit-madras.png"
                        alt="College Logo"
                        className="college-logo"
                      />
                      <div className="w-full">
                        <p className="college-name text-sm">{college.name}</p>
                        <p className="college-location text-gray-400 my-1.5">
                          {college.location} | {college.approved}
                        </p>
                        <div className="flex">
                          <div className="branch-info">
                            <div className="branch-name flex justify-center items-center">
                              <p>{college.branches.name}</p>
                              <div className="ml-2">
                                <IoIosArrowDown />
                              </div>
                            </div>
                            <div className="branch-cutof">
                              JEE-Advanced 2023 Cutoff :{" "}
                              {college.branches.cutoff}
                            </div>
                          </div>
                          <div className="arrow-right"></div>
                        </div>
                        <div className="flex justify-between my-2">
                          <div className="flex items-center gap-2 text-orange-400 text-sm cursor-pointer">
                            <span className="text-orange-400">
                              <FaArrowRight />
                            </span>
                            <span>Apply Now</span>
                          </div>
                          <div className="text-green-600 font-light flex items-center gap-2 text-sm cursor-pointer">
                            <span className="">
                              <HiOutlineDownload />
                            </span>
                            <span className="">Download Brochure</span>
                          </div>
                          <div className="text-black-600 flex items-center gap-2 text-sm cursor-pointer">
                            <span className="">
                              <RiCheckboxBlankLine />
                            </span>
                            <span className="">Add To Compare</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="course-fees-block">
                      <div className="text-green-500 font-semibold mt-2">
                        ₹{college.course.fees}
                      </div>
                      <span className="text-xs text-gray-500 mt-2">
                        {college.course.courseType}
                      </span>
                      <div className="text-xs text-gray-500 mt-2">
                        - {college.course.year}
                      </div>
                      <div className="text-orange-500 flex items-center text-xs gap-1 mt-2 cursor-pointer">
                        <span className="font-semibold">
                          <HiMiniArrowsRightLeft />
                        </span>
                        Compare Fees
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="placement-fees-block">
                      <div className="mt-1"></div>
                      <div className="text-green-500 font-semibold">
                        ₹ {college.placement.average}
                      </div>
                      <div className="text-xs text-gray-500">
                        Average Package
                      </div>
                      <div className="text-green-500 font-semibold">
                        ₹ {college.placement.highest}
                      </div>
                      <div className="text-xs text-gray-500">
                        Highest Package
                      </div>
                      <div className="text-orange-500 flex items-center text-xs gap-1 mt-2 cursor-pointer">
                        <span className="font-semibold">
                          <HiMiniArrowsRightLeft />
                        </span>
                        Compare Fees
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="placement-fees-block">
                      <div className="flex items-center gap-3">
                        <div className="text-orange-500">
                          <TiStarburst />
                        </div>
                        <div className="text-gray-500">
                          {college.userReviewRating.review} / 10
                        </div>
                      </div>
                      <div className="">
                        <p className="text-gray-500 text-sm text-wrap mt-2">
                          Based on {college.userReviewRating.users} Users <br />
                          Reviews
                        </p>
                      </div>
                      <div className="flex gap-1 items-center text-red-600 bg-yellow-100 rounded-xl justify-center w-fit px-3 text-sm mt-2">
                        <span>
                          <IoCheckmark />
                        </span>
                        <span>Best in Social Life</span>
                        <span>
                          <IoIosArrowDown />
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="ranking-block text-gray-500">
                      #{college.ranking}
                      <sup>{college.sup}</sup>/{" "}
                      <span className="text-orange-500">131</span> in India
                      <div className="flex gap-1">
                        <img src="../images/thetimes.png" width={50} />
                        <span className="text-gray-500">2023</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div ref={loadMoreRef}></div>
      </div>
    </>
  );
};

export default CollegeTable;
