// Base API URL for fetching exchange rates
const BaseUrl =
  "https://v6.exchangerate-api.com/v6/df95d31e607f2f1005e6b5c4/pair";

// Select DOM elements for dropdowns, button, message display, and time display
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const arrow = document.querySelector("#arrow");
const times = document.querySelector("#time");

// Populate dropdowns with currency options
for (const select of dropdowns) {
  for (const currCode in countryList) {
    const newOption = document.createElement("option");
    newOption.innerText = currCode; // Set the visible text for the option
    newOption.value = currCode; // Set the value of the option

    // Set default selected currencies
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption); // Add the option to the select dropdown
  }

  // Update the flag whenever the selected currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to fetch and update the exchange rate based on selected currencies
const updateExchangeRate = async () => {
  const amount = document.querySelector(".amount input");
  let amountValue = amount.value;

  // Ensure a minimum amount of 1 is set
  if (amountValue === "" || amountValue < 1) {
    amountValue = 1;
    amount.value = 1;
  }

  // Construct the API URL using selected currencies
  const url = `${BaseUrl}/${fromCurr.value}/${toCurr.value}`;
  try {
    const response = await fetch(url);

    // Check if the API request was successful
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    const rate = data.conversion_rate; // Extract conversion rate from API response
    const time = data.time_last_update_utc; // Extract the last update time
    const finalAmount = amountValue * rate; // Calculate the converted amount

    // Display the conversion result and the last update time
    msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    times.innerText = `Last updated on ${time}`;
  } catch (error) {
    // Handle errors by displaying a message
    msg.innerText = `Failed to fetch exchange rate: ${error.message}`;
  }
};

// Function to update the flag image based on the selected currency
const updateFlag = (element) => {
  const currCode = element.value; // Get the selected currency code
  const countryCode = countryList[currCode]; // Look up the corresponding country code
  const flagSrc = `https://flagsapi.com/${countryCode}/flat/64.png`; // Construct the flag image URL
  const flagImg = element.parentElement.querySelector("img"); // Select the flag image element
  flagImg.src = flagSrc; // Update the image source to the new flag
};

// Event listener to trigger exchange rate update when the form button is clicked
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // Prevent the form from submitting normally
  updateExchangeRate(); // Update the exchange rate
});

// Update the exchange rate when the page loads
window.document.addEventListener("DOMContentLoaded", () => {
  updateExchangeRate();
});

// Event listener for the arrow button to swap selected currencies
arrow.addEventListener("click", () => {
  // Swap the values of fromCurr and toCurr
  const tempValue = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempValue;

  // Update the flags after swapping
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Refresh the exchange rate after the swap
  updateExchangeRate();
});
