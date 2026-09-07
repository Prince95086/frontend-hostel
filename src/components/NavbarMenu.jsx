import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaInfoCircle, 
  FaUserGraduate, 
  FaConciergeBell, 
  FaCommentAlt,
  FaSignInAlt,
  FaUniversity,
  FaChevronDown
} from "react-icons/fa";

const NavbarMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu items with icons - ALL ITEMS ARE VISIBLE
  const menuItems = [
    { 
      name: "Home", 
      path: "/", 
      icon: <FaHome />,
      type: "link"
    },
    { 
      name: "About", 
      path: "/about", 
      icon: <FaInfoCircle />,
      type: "link"
    },
    { 
      name: "Admission", 
      path: "/admission", 
      icon: <FaUserGraduate />,
      type: "dropdown",
      dropdown: [
        { name: "Application Process", path: "/admission/process" },
        { name: "Requirements", path: "/admission/requirements" },
        { name: "Fees Structure", path: "/admission/fees" },
        { name: "Important Dates", path: "/admission/dates" }
      ]
    },
    { 
      name: "Student Facilities", 
      path: "/facilities", 
      icon: <FaConciergeBell />,
      type: "dropdown",
      dropdown: [
        { name: "Hostel Accommodation", path: "/facilities/hostel" },
        { name: "Library Services", path: "/facilities/library" },
        { name: "Sports Facilities", path: "/facilities/sports" },
        { name: "Cafeteria", path: "/facilities/cafeteria" },
        { name: "Medical Services", path: "/facilities/medical" }
      ]
    },
    { 
      name: "Complain", 
      path: "/student-signin-complain", 
      icon: <FaCommentAlt />,
      type: "link"
    },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const toggleDropdown = (itemName) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleNavClick = (item) => {
    if (item.type === "link") {
      // Handle direct navigation for regular links
      console.log(`Navigating to: ${item.name}`);
      closeAllMenus();
    }
    // For dropdown items, the toggleDropdown handles the click
  };

  return (
    <nav className={`
      sticky top-0 z-50 transition-all duration-300
      ${scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-gradient-to-r from-teal-700 to-teal-800 py-4'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo/Brand Section */}
          <div className="flex items-center space-x-3">
            <div className={`
              p-2 rounded-xl
              ${scrolled ? 'bg-teal-100' : 'bg-white/10'}
            `}>
              <FaUniversity className={`
                text-xl transition-colors duration-300
                ${scrolled ? 'text-teal-600' : 'text-yellow-600'}
              `} />
            </div>
            <div className={`
              text-xl font-bold transition-colors duration-300
              ${scrolled ? 'text-gray-800' : 'text-yellow-600'}
            `}>
              MyHostel
            </div>
          </div>

          {/* Desktop Menu - ALL ITEMS VISIBLE */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.type === "dropdown" ? (
                  // Dropdown items - ALWAYS VISIBLE
                  <>
                    <button
                      onClick={() => {
                        toggleDropdown(item.name);
                        handleNavClick(item);
                      }}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      className={`
                        flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer
                        ${scrolled 
                          ? `text-gray-700 hover:text-teal-600 hover:bg-teal-50 ${
                              isActiveLink(item.path) ? 'text-teal-600 bg-teal-50' : ''
                            }` 
                          : `text-yellow-600 hover:text-yellow-300 hover:bg-white/10 ${
                              isActiveLink(item.path) ? 'text-yellow-300 bg-white/10' : ''
                            }`
                        }
                      `}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.name}</span>
                      <FaChevronDown className={`text-xs transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    <div 
                      className={`
                        absolute left-0 mt-1 w-64 rounded-xl shadow-2xl py-2 transition-all duration-300 border backdrop-blur-md
                        ${scrolled 
                          ? 'bg-white/95 border-gray-200' 
                          : 'bg-teal-800/95 border-teal-600'
                        }
                        ${activeDropdown === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                      `}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className={`
                            flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-300 border-l-4
                            ${scrolled 
                              ? `text-gray-700 hover:text-teal-600 hover:bg-teal-50 border-transparent hover:border-teal-500 ${
                                  isActiveLink(subItem.path) ? 'text-teal-600 bg-teal-50 border-teal-500' : ''
                                }` 
                              : `text-white hover:text-yellow-300 hover:bg-white/10 border-transparent hover:border-yellow-400 ${
                                  isActiveLink(subItem.path) ? 'text-yellow-300 bg-white/10 border-yellow-400' : ''
                                }`
                            }
                          `}
                          onClick={closeAllMenus}
                        >
                          <span className="text-xs">{item.icon}</span>
                          <span>{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  // Regular menu items - ALWAYS VISIBLE AND CLICKABLE
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item)}
                    className={`
                      flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                      ${scrolled 
                        ? `text-gray-700 hover:text-teal-600 hover:bg-teal-50 ${
                            isActiveLink(item.path) ? 'text-teal-600 bg-teal-50' : ''
                          }` 
                        : `text-yellow-600 hover:text-yellow-300 hover:bg-white/10 ${
                            isActiveLink(item.path) ? 'text-yellow-300 bg-white/10' : ''
                          }`
                      }
                    `}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Sign In Button - Desktop */}
          <div className="hidden lg:block">
            <Link
              to="/signin"
              onClick={() => console.log("Sign in clicked")}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
                ${scrolled 
                  ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-xl' 
                  : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:shadow-xl'
                }
              `}
            >
              <FaSignInAlt className="text-sm" />
              <span>Sign in</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`
                p-3 rounded-xl transition-all duration-300
                ${scrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-yellow-600 hover:bg-white/10'
                }
              `}
            >
              {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - ALL ITEMS VISIBLE */}
        <div className={`
          lg:hidden transition-all duration-300 overflow-hidden
          ${menuOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'}
        `}>
          <div className={`
            rounded-2xl p-4 space-y-2 backdrop-blur-md border
            ${scrolled ? 'bg-white/95 border-gray-200' : 'bg-teal-800/95 border-teal-600'}
          `}>
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.type === "dropdown" ? (
                  // Mobile dropdown items - ALWAYS VISIBLE
                  <>
                    <button
                      onClick={() => {
                        toggleDropdown(item.name);
                        handleNavClick(item);
                      }}
                      className={`
                        flex items-center justify-between w-full px-4 py-4 rounded-xl text-base font-semibold transition-all duration-300
                        ${scrolled 
                          ? `text-gray-700 hover:text-teal-600 hover:bg-teal-50 ${
                              isActiveLink(item.path) ? 'text-teal-600 bg-teal-50' : ''
                            }` 
                          : `text-white hover:text-yellow-300 hover:bg-white/10 ${
                              isActiveLink(item.path) ? 'text-yellow-300 bg-white/10' : ''
                            }`
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <FaChevronDown className={`text-xs transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Mobile Dropdown */}
                    {activeDropdown === item.name && (
                      <div className="ml-6 mt-2 space-y-2 border-l-2 border-teal-300">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`
                              flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-300
                              ${scrolled 
                                ? `text-gray-600 hover:text-teal-600 hover:bg-teal-50 ${
                                    isActiveLink(subItem.path) ? 'text-teal-600 bg-teal-50' : ''
                                  }` 
                                : `text-teal-200 hover:text-yellow-300 hover:bg-white/10 ${
                                    isActiveLink(subItem.path) ? 'text-yellow-300 bg-white/10' : ''
                                  }`
                              }
                            `}
                            onClick={closeAllMenus}
                          >
                            <span className="text-xs">{item.icon}</span>
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Mobile regular menu items - ALWAYS VISIBLE AND CLICKABLE
                  <Link
                    to={item.path}
                    onClick={() => handleNavClick(item)}
                    className={`
                      flex items-center space-x-3 px-4 py-4 rounded-xl text-base font-semibold transition-all duration-300
                      ${scrolled 
                        ? `text-gray-700 hover:text-teal-600 hover:bg-teal-50 ${
                            isActiveLink(item.path) ? 'text-teal-600 bg-teal-50' : ''
                          }` 
                        : `text-white hover:text-yellow-300 hover:bg-white/10 ${
                            isActiveLink(item.path) ? 'text-yellow-300 bg-white/10' : ''
                          }`
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Sign In Button */}
            <Link
              to="/signin"
              onClick={() => {
                console.log("Mobile Sign in clicked");
                closeAllMenus();
              }}
              className={`
                flex items-center justify-center space-x-2 w-full px-4 py-4 rounded-xl font-semibold transition-all duration-300 mt-4
                ${scrolled 
                  ? 'bg-teal-600 text-white hover:bg-teal-700' 
                  : 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                }
              `}
            >
              <FaSignInAlt />
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMenu;