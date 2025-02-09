import React from "react";
import { Film } from "lucide-react";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <div className="bg-indigo-700 py-10 px-5 text-sm text-[#fafafa] ">
      <div className="mx-auto flex flex-col justify-between gap-y-7 lg:flex-row max-w-screen-xl">
        <div className="space-y-3">
          {" "}
          <div className="gap-2 text-white italic flex items-center gap-x-2">
            <Film className="h-5 w-5" />
            <p className="font-bold text-base">Movie Z</p>
          </div>
          <div className="text-sm font-[14px] text-white">
            {" "}
            © 2024 Movie Z. All Rights Reserved.
          </div>
        </div>
        <div className="flex gap-x-12 lg:gap-x-24">
          <div className="space-y-3">
            <h4>Contact Information</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-x-3">
                <Mail className="w-4 h-4" />
                <div>
                  <h5 className="font-medium">Email</h5>
                  <p>support@movieZ.com</p>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <Phone className="w-4 h-4" />
                <div>
                  <h5 className="font-medium">Phone</h5>
                  <p>+976 89336639</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4>Follow us</h4>
            <div className="flex flex-col gap-3 lg:flex-row">
              <span className="font-medium">Facebook</span>
              <span className="font-medium">Instagram</span>
              <span className="font-medium">Twitter</span>
              <span className="font-medium">Youtube</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
