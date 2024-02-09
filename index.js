const inputField = document.getElementById("input-field");
const btn = document.querySelector(".btn");
const ipAddress = document.getElementById("ip-address");
const city = document.getElementById("location");
const utc = document.getElementById("timezone");
const isp = document.getElementById("isp");

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function getDetails(e) {
  e.preventDefault();

  const inputValue = inputField.value;

  function getInputType() {
    let inputType = "";

    if (/\.[a-zA-Z]+$/.test(inputValue)) {
      inputType = "domain";
    } else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(inputValue)) {
      inputType = "ipAddress";
    } else {
      inputType = "invalid input";
    }
    return inputType;
  }

  const dataType = getInputType();

  function getUrl() {
    let url = "";

    if (dataType === "domain") {
      url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_iGqIyna2yEvNqjgB78hFDglPpqBrW&${dataType}=${inputValue}`;
    } else if (dataType === "ipAddress") {
      url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_iGqIyna2yEvNqjgB78hFDglPpqBrW&${dataType}=${inputValue}`;
    }
    return url;
  }

  const link = getUrl();

  const fetchData = async () => {
    const response = await fetch(link);
    const data = await response.json();
    return data;
  };

  fetchData()
    .then((data) => {
      ipAddress.textContent = data.ip;
      city.textContent = `${data.location["city"]}, ${data.location["region"]}`;
      utc.textContent = data.location["timezone"];
      isp.textContent = data.isp;
      map.setView([data.location["lat"], data.location["lng"]], 13);

      var marker = L.marker([data.location["lat"], data.location["lng"]]).addTo(
        map
      );
      var circle = L.circle([data.location["lat"], data.location["lng"]], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 500,
      }).addTo(map);

      console.log(data.location["lng"]);
    })
    .catch(() => alert("Opps! an error ocurred, check the data supplied"));
}

btn.addEventListener("click", getDetails);
