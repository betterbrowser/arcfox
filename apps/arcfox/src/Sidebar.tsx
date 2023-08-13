import { FC } from "react";
import "./sidebar.css";
import { SidebarContent } from "./Sidebar/SidebarContent";

const SidebarFooter: FC = () => {
  return (
    <div className="footer">
      <button id="archive">
        <i className="fa-solid fa-box-archive"></i>
      </button>
      <button id="new">
        <i className="fa-solid fa-square-plus"></i>
      </button>
    </div>
  );
};

export const Sidebar: FC = () => {
  // TODO: this structure is basically copy-paste of legacy structure
  //       cleanup in future
  return (
    <>
      <div id="sidebar">
        <div id="sidebar-header">
          <div id="page-control">
            <div id="action-buttons">
              <button id="close">
                <i className="fa-solid fa-circle"></i>
              </button>
              <button id="size">
                <i className="fa-solid fa-circle"></i>
              </button>
              <button id="hide">
                <i className="fa-solid fa-circle"></i>
              </button>
            </div>
            <button id="back">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <button id="front">
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button id="refresh">
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
          <div className="address-bar">
            <input id="search-input" type="text" placeholder="Search..." />
          </div>
        </div>
        <SidebarContent />
      </div>
      <SidebarFooter />
    </>
  );
};
