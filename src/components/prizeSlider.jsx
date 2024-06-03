import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";

function SampleNextArrow(props) {
  const { style, onClick } = props;
  return <div className="custom-arrow next-arrow" style={{ ...style, display: "block" }} onClick={onClick} />;
}

function SamplePrevArrow(props) {
  const { style, onClick } = props;
  return <div className="custom-arrow prev-arrow" style={{ ...style, display: "block" }} onClick={onClick} />;
}

const playerPriceContent = [
  {
    id: 8247,
    prizeID: "e5813d18-c322-4ab6-b600-ea7df0fc7e1e",
    prizeName: "1x Signed Julian Alvarez Shirt",
    prizeTypeID: 3,
    prizeDescription: "1x Signed Julian Alvarez Shirt",
    prizeValue: 1,
    prizeSplitPercentage: 0,
    prizeDrawID: "9f3bc295-1e6f-4a6d-8524-1b1d4737de94",
    prizeImageURL: "https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/160d662e-382d-4bb6-bd7a-2c2d12089d5f-maancityimages.jpg",
    prizeQuantity: 1,
  },
  {
    id: 8248,
    prizeID: "940086a9-a93b-4f50-b346-ac5abe13646d",
    prizeName: "1st Prize £2,500",
    prizeTypeID: 1,
    prizeDescription: "1st Prize £2,500",
    prizeValue: 2500,
    prizeSplitPercentage: 0,
    prizeDrawID: "9f3bc295-1e6f-4a6d-8524-1b1d4737de94",
    prizeImageURL: "https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/aa05d3f9-9dfd-4e87-9c46-3ec92e959728-halaand.jpg",
    prizeQuantity: 1,
  },
  {
    id: 8249,
    prizeID: "3eb33d82-be85-440a-a4a5-f536ec54a247",
    prizeName: "£100 runners up prizes",
    prizeTypeID: 1,
    prizeDescription: "£100 runners up prizes",
    prizeValue: 100,
    prizeSplitPercentage: 0,
    prizeDrawID: "9f3bc295-1e6f-4a6d-8524-1b1d4737de94",
    prizeImageURL: "https://s3.eu-west-2.amazonaws.com/pfw.storage.bucket/images/97542cdd-60a3-430a-8c85-58affa147ec8-city.jpg",
    prizeQuantity: 5,
  },
];

export default function PrizeSlider() {
  const siteID = process.env.REACT_APP_SITE_ID;
  const API_URL = process.env.REACT_APP_API_URL;

  const [scroll, setScroll] = useState(false);
  const [DrawData, setDrawData] = useState([]);
  const [PrizeData, setPrizeData] = useState([]);
  const parser = new DOMParser();
  const [totalQuantities, setTotalQuantities] = useState(0);
  const processedData = PrizeData && PrizeData.length === 3 ? PrizeData.concat(PrizeData) : PrizeData;
  const slidesToShow = PrizeData && PrizeData.length <= 3 ? PrizeData.length : 3;

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerPadding: "40px",
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
    ],
    // cssEase: "linear"
  };

  function calculateTotalQuantity(PrizeData) {
    let sum = 0;
    {
      PrizeData.forEach((item) => {
        sum += item.prizeQuantity;
      });
    }
    return sum;
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 10);
    });
    axios.get(API_URL + "/sites/" + siteID + "/draws").then((res) => {
      let alldraw = res.data.content;
      let activeDraw = res.data.content.filter((item) => item.drawIsClosed !== 1 && item.drawIsVisible === 1 && item.drawIsActive === 1);
      let selectedDraw = {};
      if (activeDraw.length > 0) {
        selectedDraw = activeDraw[0];
      } else {
        selectedDraw = alldraw[0];
      }
      setDrawData(selectedDraw);
    });
  }, []);

  useEffect(() => {
    setPrizeData(playerPriceContent);
    setTotalQuantities(calculateTotalQuantity(playerPriceContent));
  }, []);

  return (
    <div className="prize-block-inner px-0 py-5 pt-0">
      <Slider {...settings}>
        {playerPriceContent?.map((item) => {
          return (
            <div className={`prize-block prize-${item.prizeID}`}>
              <div className="rounded-3 border m-2">
                <div
                  className="prize-photo col-sm-12 col-md-12 col-lg-12 text-center p-5 position-relative"
                  style={{
                    height: 250,
                    backgroundImage: `url(${item.prizeImageURL})`,
                    backgroundSize: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    backgroundPosition: "top",
                  }}
                ></div>
                <div
                  className="prize-block-testimonial bg-white text-center py-3 col-sm-12 col-md-12 col-lg-12"
                  style={{
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                >
                  <h4
                    className="s-body"
                    dangerouslySetInnerHTML={{
                      __html: parser.parseFromString(`${item.prizeName}`, "text/html").body.textContent,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
