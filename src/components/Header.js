import React from "react";
import { Button } from "@codedrops/react-ui";

const NAV_ITEMS = ({ isAuthenticated }) =>
  [
    { label: "Home", value: "HOME", visible: isAuthenticated },
    { label: "History", value: "HISTORY", visible: isAuthenticated },
    { label: "Settings", value: "SETTINGS", visible: isAuthenticated },
    { label: "Auth", value: "AUTH", visible: !isAuthenticated },
  ].filter((item) => item.visible);

const Controls = ({ activePage, logout }) => {
  switch (activePage) {
    case "SETTINGS":
      return (
        <Button size="sm" onClick={logout}>
          Logout
        </Button>
      );
    default:
      return null;
  }
};

const Header = ({ state, activePage, setActivePage, logout }) => {
  const { session } = state;
  const { isAuthenticated } = session || {};

  return (
    <div className="header mb">
      <nav>
        {NAV_ITEMS({ isAuthenticated }).map(({ label, value }) => (
          <span
            key={value}
            className={`nav-item ${activePage === value ? "active-page" : ""}`}
            onClick={() => setActivePage(value)}
          >
            {label}
          </span>
        ))}
      </nav>
      <Controls activePage={activePage} logout={logout} />
    </div>
  );
};

export default Header;
