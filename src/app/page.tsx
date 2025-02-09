"use client";
import { ImageSlider } from "@/components/ImageSlider";
import Popular from "@/components/Popular";
import TopRated from "@/components/TopRated";
import Upcoming from "@/components/Upcoming";

export default function Home() {
  return (
    <div className="relative w-screen overflow-hidden">
      <ImageSlider />
      <section className="page-primary py-8 pl-5 lg:py-13 space-y-8 lg:space-y-13">
        <Upcoming />
        <TopRated />
        <Popular />
      </section>
    </div>
  );
}
