import React from "react";
import {
  FaUtensils,
  FaCoffee,
  FaClock,
  FaStar,
  FaHeart,
  FaLeaf,
  FaSeedling,
  FaBreadSlice
} from "react-icons/fa";
import Abovenavbar from "../Abovenavbar";
import NavbarMenu from "../NavbarMenu";

const Cafeteria = () => {
  const menuCategories = [
    {
      category: "Breakfast",
      items: [
        { name: "Masala Dosa", price: "₹40", veg: true, popular: true },
        { name: "Poha", price: "₹25", veg: true, popular: false },
        { name: "Sandwich", price: "₹35", veg: true, popular: true },
        { name: "Milk & Cereal", price: "₹30", veg: true, popular: false }
      ],
      timing: "7:00 AM - 10:30 AM"
    },
    {
      category: "Lunch",
      items: [
        { name: "Thali Meal", price: "₹60", veg: true, popular: true },
        { name: "Chicken Curry", price: "₹80", veg: false, popular: true },
        { name: "Rice & Dal", price: "₹45", veg: true, popular: false },
        { name: "Roti & Sabzi", price: "₹35", veg: true, popular: false }
      ],
      timing: "12:00 PM - 3:00 PM"
    },
    {
      category: "Snacks",
      items: [
        { name: "French Fries", price: "₹40", veg: true, popular: true },
        { name: "Burger", price: "₹50", veg: true, popular: true },
        { name: "Cold Coffee", price: "₹35", veg: true, popular: false },
        { name: "Samosa", price: "₹20", veg: true, popular: true }
      ],
      timing: "4:00 PM - 7:00 PM"
    }
  ];

  const features = [
    { icon: FaLeaf, name: "Hygienic Kitchen", description: "Daily cleaned and sanitized" },
    { icon: FaSeedling, name: "Fresh Ingredients", description: "Locally sourced produce" },
    { icon: FaHeart, name: "Healthy Options", description: "Nutritionist approved meals" },
    { icon: FaBreadSlice, name: "Variety", description: "Diverse menu options" }
  ];

  return (
    <div>
    <Abovenavbar/>
    <NavbarMenu/>
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <FaUtensils className="text-6xl text-yellow-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Cafeteria</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Delicious, hygienic, and affordable meals in a comfortable dining environment
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Features */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.name}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Menu */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Today's Menu</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Freshly prepared meals served with love and care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {menuCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-t-2xl">
                  <h3 className="text-2xl font-bold mb-2">{category.category}</h3>
                  <div className="flex items-center space-x-2 text-orange-200">
                    <FaClock />
                    <span>{category.timing}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div>
                            <div className="font-semibold text-gray-800 flex items-center space-x-2">
                              <span>{item.name}</span>
                              {item.popular && <FaStar className="text-yellow-400" />}
                            </div>
                            <div className={`text-xs ${item.veg ? 'text-green-600' : 'text-red-600'}`}>
                              {item.veg ? '🟢 Veg' : '🔴 Non-Veg'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-orange-600">{item.price}</div>
                          <button className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded transition-colors">
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Special Student Offers</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { offer: "Breakfast Combo", price: "₹50", desc: "Dosa + Coffee" },
                { offer: "Lunch Special", price: "₹70", desc: "Thali + Dessert" },
                { offer: "Evening Snack", price: "₹40", desc: "Burger + Cold Drink" }
              ].map((special, index) => (
                <div key={index} className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">{special.offer}</div>
                  <div className="text-3xl font-bold text-yellow-300 mb-1">{special.price}</div>
                  <div className="text-green-100">{special.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-green-100">* Show your student ID to avail these offers</p>
          </div>
        </section>

        {/* Operating Hours */}
        <section className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <FaCoffee className="text-orange-500" />
                <span>Operating Hours</span>
              </h3>
              <div className="space-y-4">
                {[
                  { period: "Breakfast", time: "7:00 AM - 10:30 AM" },
                  { period: "Lunch", time: "12:00 PM - 3:00 PM" },
                  { period: "Snacks", time: "4:00 PM - 7:00 PM" },
                  { period: "Dinner", time: "7:30 PM - 10:00 PM" }
                ].map((slot, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-semibold text-gray-800">{slot.period}</span>
                    <span className="text-orange-600 font-bold">{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Services</h3>
              <div className="space-y-3">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition-colors">
                  Online Order
                </button>
                <button className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 rounded-xl font-semibold transition-colors">
                  Monthly Meal Plan
                </button>
                <button className="w-full border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white py-3 rounded-xl font-semibold transition-colors">
                  Feedback
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Cafeteria;