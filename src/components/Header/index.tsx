'use client'
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";

import DropdownUser from "./DropdownUser";
import { BiSearch } from "react-icons/bi";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-9 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="hidden flex-1 sm:block">
          <form action="#" method="POST" className="w-full max-w-xl">
            <div className="relative w-full">

              {/* <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none"
              /> */}
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Dark Mode Toggler --> */}
            {/* <DarkModeSwitcher /> */}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
