import React, { useState, useEffect } from 'react';
import Ban from './Ban';

function Card() {
  const [dogData, setDogData] = useState({
    name: '',
    lifeSpan: '',
    height: '',
    weight: '',
    imgSrc: ''
  });

  const [bannedAttributes, setBannedAttributes] = useState([]); // Track banned values

  // Async function to fetch random dog data and ensure it doesn't match banned values
  async function getData() {
    const url = "https://api.thedogapi.com/v1/images/search?api_key=live_G5xuOg4EgCJI0DYwyeTZCGsq6dhugQVCX0wIDbHrJHo7Sa5pngXXAGNsiZaB52aX";
    try {
      let validData = false;
      let json;

      // Loop until valid data is found
      while (!validData) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response error: ${response.status}`);
        }

        json = await response.json();
        const breed = json[0]?.breeds?.[0]; // Access breed data

        if (breed && breed.name && breed.life_span && breed.height?.metric && breed.weight?.metric && json[0]?.url) {
          // Check against banned values
          const isBanned = bannedAttributes.some(ban => 
            ban === breed.height.metric || ban === breed.weight.metric || ban === breed.life_span
          );

          if (!isBanned) {
            validData = true; // Stop loop if data is valid and not banned

            // Extract the valid data
            const name = breed.name;
            const lifeSpan = breed.life_span;
            const height = breed.height.metric;
            const weight = breed.weight.metric;
            const imgSrc = json[0].url;

            // Update the state with valid data
            setDogData({ name, lifeSpan, height, weight, imgSrc });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch initial data when the component is first mounted
  useEffect(() => {
    getData();
  }, []);

  // Function to handle banning an attribute value
  function handleBanAttribute(attrValue) {
    setBannedAttributes([...bannedAttributes, attrValue]); // Add the value to bannedAttributes array
  }

  // Function to remove a banned attribute
  function handleRemoveBan(attrValue) {
    setBannedAttributes(bannedAttributes.filter(ban => ban !== attrValue)); // Remove the clicked attribute
  }

  // Function to handle "Discover!" button click
  function handleDiscoverClick() {
    getData(); // Fetch new random dog breed data when the button is clicked
  }

  return (
    <div className="card-container">
      <h1>Dog Master</h1>
      <h2>Love Dogs? Know about them!</h2>
      <h2>{dogData.name}</h2>
      <div className='attr'>
        <button onClick={() => handleBanAttribute(dogData.lifeSpan)}>Life Span: {dogData.lifeSpan}</button>
        <button onClick={() => handleBanAttribute(dogData.height)}>Height: {dogData.height} cm</button>
        <button onClick={() => handleBanAttribute(dogData.weight)}>Weight: {dogData.weight} kg</button>
      </div>
      {dogData.imgSrc && <img src={dogData.imgSrc} alt="dog img" />}
      <button className="discover-btn" onClick={handleDiscoverClick}>
        Discover!
      </button>

      {/* Display banned attributes */}
      <Ban bannedAttributes={bannedAttributes} onRemoveBan={handleRemoveBan} />
    </div>
  );
}

export default Card;
