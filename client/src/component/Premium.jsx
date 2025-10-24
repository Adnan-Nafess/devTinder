import axios from "axios";
import { BASE_URL } from "../utils/constant";

const Premium = () => {

  const handleBuyClick = async (type) => {
    try {
    const order = await axios.post(`${BASE_URL}/payment/create`, { memberShipType: type }, { withCredentials: true });

    // it should open the razorpay Dialog Box

    const { amount, keyId, currency, notes, orderId} = order.data;

    const options = {
        key: keyId,
        amount,
        currency,
        name: "Dev Tinder",
        description: 'Connect to other developer',
        order_id: orderId, 
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId || "",
        },
        theme: {
          color: '#F37254'
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    }catch(err) {
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
    <div className="min-h-screen dark:bg-gray-900 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-16 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        Upgrade to <span className="text-pink-500">Premium 💎</span>
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-xl">
        Choose your plan and enjoy exclusive benefits to connect faster and get noticed by more people.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-5xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition duration-300`}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
            )}

            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4`}
            >
              {plan.name === "Silver" ? "🥈" : "🥇"}
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              {plan.name} Plan
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-lg font-semibold">
              {plan.price}
            </p>

            <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-green-500">✔️</span> {feature}
                </li>
              ))}
            </ul>

            <button
               onClick={() => handleBuyClick(plan.name.toLowerCase())}
              className={`w-full py-3 rounded-full cursor-pointer text-lg font-semibold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition`}
            >
              Upgrade Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Premium;
