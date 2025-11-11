import React, { useState, useEffect } from "react";
import * as M from "./MainStyle";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "/src/assets/image/Main/image1.svg";
import image2 from "/src/assets/image/Main/image2.svg";
import image3 from "/src/assets/image/Main/image3.svg";
import image4 from "/src/assets/image/Main/image4.svg";
import image5 from "/src/assets/image/Main/image5.svg";
import image6 from "/src/assets/image/Main/image6.svg";

export default function Main() {
  const images = [image1, image2, image3, image4, image5, image6];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    axios
      .post(
        "https://api.telegro.kr/hits",
        {},
        {
          withCredentials: true,
        }
      )
      .catch((error) => {
        console.error(error);
      });

    return () => {};
  }, []);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  return (
    <>
      <div
        style={{ width: "100%", minHeight: "160px", backgroundColor: "#000", border: "none" }}
      ></div>
      <M.NewContainer>
        <div
          style={{
            display: "flex",
            transition: "transform 0.5s ease-in-out",
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <M.ItemImage key={index} src={image} alt={`Slide ${index}`} />
          ))}
        </div>
      </M.NewContainer>
    </>
  );
}
