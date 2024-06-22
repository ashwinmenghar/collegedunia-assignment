const filterData = (property, setData, data, sortDirection) => {
  let sortedData = [...data].sort((a, b) => {
    let comparisonValue = 0;
    // Handle sorting by different properties
    switch (property) {
      case "collegeduniaRank":
        comparisonValue = a.collegeduniaRank - b.collegeduniaRank;
        break;
      case "fees":
        const feeA = parseFloat(a.course.fees.replace(/,/g, ""));
        const feeB = parseFloat(b.course.fees.replace(/,/g, ""));
        comparisonValue = feeA - feeB;
        break;
      case "userReviewRating":
        const reviewA = parseFloat(a.userReviewRating?.review) || 0;
        const reviewB = parseFloat(b.userReviewRating?.review) || 0;
        comparisonValue = reviewA - reviewB;
        break;
      case "ranking":
        const rankingA = parseFloat(a?.ranking) || 0;
        const rankingB = parseFloat(b?.ranking) || 0;
        comparisonValue = rankingA - rankingB;
        break;
      default:
        console.warn(`Unknown sorting property: ${property}`);
        break;
    }

    return sortDirection === "asc" ? comparisonValue : -comparisonValue;
  });
  setData(sortedData);
};

module.exports = filterData;
