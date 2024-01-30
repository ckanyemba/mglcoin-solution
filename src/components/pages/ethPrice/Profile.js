import { ProfileFilled } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

//Function to fetch the cyrrent ETH price
async function fetchEthPrice() {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
    const data = await response.json();
    return data.USD;
}

function Profile({ onPriceFetched }) {
    const [ethPrice, setEthPrice] = useState(null);

useEffect(() => {
    async function fetchData() {
        const price = await fetchEthPrice();
        setEthPrice(price);

        // Call the callback function with the fetched price
        onPriceFetched(price)
    }

    fetchData();
}, []);

return (
    <div>
        <h1>Profile</h1>
        <p>Current ETH Price: ${ethPrice}</p>
    </div>
);
 }

export default Profile;