import { Button, Row, Col } from "antd";
import { motion, useViewportScroll } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PairCardButton from "../component/PairCardButton";
import axios from "axios";

const pair = [
  { name: "ETH", percent: 3.19763724, price: 57832.47921786725 },
  { name: "ETH", percent: 3.19763724, price: 57832.47921786725 },
  { name: "ETH", percent: 3.19763724, price: 57832.47921786725 },
  { name: "ETH", percent: 3.19763724, price: 57832.47921786725 },
  { name: "ETH", percent: 3.19763724, price: 57832.47921786725 },
  { name: "ETH", percent: 3.19763724, price: 57832.47921786725 }
];

function EthPrice() {
  const { t, i18n } = useTranslation();
  const [livePrices, setLivePrices] = useState([]);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );

        
        if (response.data && response.data.ethereum) {
            const livePrice = response.data.ethereum.usd;
  
            // Update the live price for each ETH pair
            const updatedPairs = pair.map((item) => ({
              ...item,
              price: livePrice,
            }));
  
            setLivePrices(updatedPairs);
          }
        } catch (error) {
          console.error('Error fetching live prices:', error);
        }
      };
  
      // Fetch live prices on component mount
      fetchLivePrices();
  
      // Fetch live prices every minute (adjust the interval as needed)
      const intervalId = setInterval(fetchLivePrices, 60000);
  
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, []);

  return (
    <>
      <div className="relative mb-0">
        <img
          src="/assets/img/background2.png"
          className="w-screen absolute top-0 back"
        />
        <div className="w-11/12 xl:w-5/6 m-auto ">
          {/* Use the 'pair' array directly instead of props.coinData */}
          <motion.div
            className="justify-between hidden md:flex"
            animate={{
              scale: [1, 1],
              opacity: [0, 1]
            }}
            transition={{ duration: 4 }}
          >
            {livePrices.map((item, index) => (
              <PairCardButton
                key={index}
                title={item.name}
                percent={item.percent}
                amount1={item.price}
              />
            ))}
          </motion.div>
          <motion.div
            className="block md:hidden"
            animate={{
              scale: [1, 1],
              opacity: [0, 1],
            }}
            transition={{ duration: 4 }}
          >
            {/* Similar changes for mobile view */}
            <div className="flex justify-between mb-4">
              {livePrices.slice(0, 2).map((item, index) => (
                <PairCardButton
                  key={index}
                  title={item.name}
                  percent={item.percent}
                  amount1={item.price}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {livePrices.slice(2, 4).map((item, index) => (
                <PairCardButton
                  key={index}
                  title={item.name}
                  percent={item.percent}
                  amount1={item.price}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default EthPrice;
