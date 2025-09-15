import { getOrCreateUser } from "@/lib/getOrCreateUser";
import React from "react";

const NavBar = () => {
  const user = getOrCreateUser();
  return <div>NavBar</div>;
};

export default NavBar;
