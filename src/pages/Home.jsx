import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";
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

  // ... rest of your component remains the same
  return <div>{/* ... rest of the code */}</div>;
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
