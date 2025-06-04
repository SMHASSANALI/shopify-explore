import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 text-center text-sm text-black/60 border-t border-black/10 mt-10">
      <p>&copy; {new Date().getFullYear()} Haaaib. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
