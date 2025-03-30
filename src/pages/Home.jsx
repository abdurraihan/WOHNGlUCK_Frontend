import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ListingItem from "../Components/ListingItem.jsx";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res1 = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?offer=true&limit=4`
        );
        const data1 = await res1.json();
        setOfferListings(data1);

        const res2 = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=rent&limit=4`
        );
        const data2 = await res2.json();
        setRentListings(data2);

        const res3 = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listing/get?type=sale&limit=4`
        );
        const data3 = await res3.json();
        setSaleListings(data3);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className="flex flex-col items-center text-center gap-8 p-20 sm:p-28 max-w-5xl mx-auto">
        <h1 className="text-slate-800 font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight">
          Discover Your <span className="text-blue-600">Dream Home</span> <br />
          With Just a Few Clicks
        </h1>
        <p className="text-gray-500 text-lg sm:text-xl max-w-3xl">
          Explore a curated selection of properties tailored to your needs.
          Whether you’re buying, renting, or investing, we make the process
          effortless.
        </p>
        <Link
          to="/search"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-300"
        >
          Start Exploring
        </Link>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      )}

      {/* Swiper Section */}
      {!loading && offerListings.length > 0 && (
        <Swiper navigation>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Listing Sections */}
      {!loading && (
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
          {offerListings.length > 0 && (
            <ListingSection
              title="Recent Offers"
              listings={offerListings}
              link="/search?offer=true"
              linkText="Show more offers"
            />
          )}
          {rentListings.length > 0 && (
            <ListingSection
              title="Recent Places for Rent"
              listings={rentListings}
              link="/search?type=rent"
              linkText="Show more places for rent"
            />
          )}
          {saleListings.length > 0 && (
            <ListingSection
              title="Recent Places for Sale"
              listings={saleListings}
              link="/search?type=sale"
              linkText="Show more places for sale"
            />
          )}
        </div>
      )}
    </div>
  );
}

function ListingSection({ title, listings, link, linkText }) {
  return (
    <div>
      <div className="my-3">
        <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
        <Link className="text-sm text-blue-800 hover:underline" to={link}>
          {linkText}
        </Link>
      </div>
      <div className="flex flex-wrap gap-4">
        {listings.map((listing) => (
          <ListingItem listing={listing} key={listing._id} />
        ))}
      </div>
    </div>
  );
}
