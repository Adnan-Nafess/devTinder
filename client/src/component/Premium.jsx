import axios from "axios";
import { BASE_URL } from "../utils/constant";

const Premium = () => {
  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        `${BASE_URL}/payment/create`,
        { memberShipType: type },
        { withCredentials: true },
      );

      // it should open the razorpay Dialog Box

      const { amount, keyId, currency, notes, orderId } = order.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Dev Tinder",
        description: "Connect to other developer",
        order_id: orderId,
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId || "",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
    }
  };

  const plans = [
    {
      name: "Silver",
      color: "from-gray-300 to-gray-500",
      price: "₹499 / month",
      features: [
        "View unlimited profiles",
        "Send 50 connection requests",
        "Chat access for accepted requests",
        "Priority support",
      ],
    },
    {
      name: "Gold",
      color: "from-yellow-400 to-yellow-600",
      price: "₹999 / month",
      features: [
        "Everything in Silver",
        "Unlimited connection requests",
        "Profile boost & top visibility",
        "VIP badge on your profile",
      ],
      popular: true,
    },
  ];

  return (
    <section className="w-full min-h-[calc(100vh-64px)] ">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-3">
          Upgrade to <span className="text-yellow-400">Premium</span>
        </h1>
        <p className="text-center text-slate-300 max-w-xl mx-auto mb-12 text-sm sm:text-base">
          Choose a plan to connect faster and get better visibility among
          developers.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          {/* Silver */}
          <div className="w-full max-w-sm bg-slate-800/90 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-600 flex items-center justify-center text-xl">
                🥈
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center text-white mb-1">
              Silver Plan
            </h2>
            <p className="text-center text-slate-400 mb-6">₹499 / month</p>

            <ul className="space-y-3 text-slate-300 text-sm mb-6">
              <li>✔ View unlimited profiles</li>
              <li>✔ Send 50 connection requests</li>
              <li>✔ Chat with accepted matches</li>
              <li>✔ Priority support</li>
            </ul>

            <button
              onClick={() => handleBuyClick("silver")}
              className="w-full py-2.5 rounded-full bg-slate-600 hover:bg-slate-700 text-white font-medium"
            >
              Upgrade Now
            </button>
          </div>

          {/* Gold */}
          <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 shadow-2xl ring-2 ring-yellow-400">
            <span className="absolute -mt-4 ml-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </span>

            <div className="flex justify-center mb-4 mt-4">
              <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-xl text-black">
                🥇
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center text-white mb-1">
              Gold Plan
            </h2>
            <p className="text-center text-slate-400 mb-6">₹999 / month</p>

            <ul className="space-y-3 text-slate-300 text-sm mb-6">
              <li>✔ Everything in Silver</li>
              <li>✔ Unlimited connection requests</li>
              <li>✔ Profile boost</li>
              <li>✔ VIP badge</li>
            </ul>

            <button
              onClick={() => handleBuyClick("gold")}
              className="w-full py-2.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Premium;
