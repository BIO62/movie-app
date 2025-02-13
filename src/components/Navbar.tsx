"use client"
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="bg-primary p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-white font-bold text-xl cursor-pointer"
          onClick={() => router.push("/")} // Navigate to the home page
        >
          Movie App
        </h1>
        <div className="space-x-6">
          <button
            className="text-white hover:text-gray-300"
            onClick={() => router.push("/genres")}
          >
            Genres
          </button>
          <button
            className="text-white hover:text-gray-300"
            onClick={() => router.push("/popular")}
          >
            Popular
          </button>
          <button
            className="text-white hover:text-gray-300"
            onClick={() => router.push("/about")}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

