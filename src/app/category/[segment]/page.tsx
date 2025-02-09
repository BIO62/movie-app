"use client";
import { useParams } from "next/navigation";
import CategoryList from "@/components/CategoryList";

const Page = () => {
  const params = useParams();
  console.log(params.id);

  return (
    <div>
      <CategoryList />
    </div>
  );
};

export default Page;
