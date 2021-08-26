import { useState, useEffect } from "react";
import { URLs, Cookies } from "../Urls";
import Axios from "axios";

export const useGlobal = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Global + "get/");
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return data;
};

export const useBackup = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Backup + "get/");
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return data;
};

export const useMonitor = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Monitor + "get/");
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return data;
};

export const useServer = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Servers + "get/");
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return data;
};

export const useCriticality = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().Criticality + "get/");
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return data;
};

export const useMenuActive = () => {
  const [data, setData] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().MenuActive);
        // console.log(result.data);
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return data;
};

export const useServerGroupTechnology = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        Axios.defaults.headers.common = {
          "X-CSRFToken": Cookies("csrftoken"),
        };
        const result = await Axios.get(URLs().ServerGroupTechnology);
        // console.log(result.data);
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return data;
};

// const useGlobal = () => {
//   // 1
//   const [global, setGlobal] = React.useState([]);

//   React.useEffect(() => {
//     async function fetchUsers() {
//       const fullResponse = await fetch(
//         "http://localhost/patches/api/settings/"
//       );
//       const responseJson = await fullResponse.json();
//       setGlobal(responseJson.data);
//     }

//     fetchUsers();
//   }, []);

//   // 2
//   return global;
// };

// export default useGlobal;

// function getCookie(name) {
//   var cookieValue = null;
//   if (document.cookie && document.cookie !== "") {
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = cookies[i].trim();
//       // Does this cookie string begin with the name we want?
//       if (cookie.substring(0, name.length + 1) === name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }

// function loadGlobalConfig(callback) {
//   const xhr = new XMLHttpRequest();
//   const method = "GET"; // "POST";
//   const responseType = "json";
//   xhr.responseType = responseType;
//   xhr.open(method, URLs().Global);
//   xhr.onload = function () {
//     callback(xhr.response, xhr.status);
//   };
//   xhr.onerror = function (e) {
//     console.log(e);
//     callback({ message: "The request was an error" });
//   };
//   xhr.send();
// }

// export const useBackup = () => {
//   const [backup, setBackup] = useState([]);

//     const performLookup = () => {};
//   useEffect(() => {
//     const CallBack = (response, status) => {
//       setGlobal(response);
//     };
//     loadBackup(CallBack);
//   }, []);
//   return backup;
// };

// export function setGlobalConfig(callback, method, global, account_name) {
//   let jsonData;
//   if (global) {
//     jsonData = JSON.stringify(global);
//   }
//   const xhr = new XMLHttpRequest();
//   const url = URLs().Global + `${account_name}/`;
//   xhr.responseType = "json";
//   const csrftoken = getCookie("csrftoken");
//   xhr.open(method, url);
//   xhr.setRequestHeader("Content-Type", "application/json");

//   if (csrftoken) {
//     // xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
//     xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
//     xhr.setRequestHeader("X-CSRFToken", csrftoken);
//   }

//   xhr.onload = function () {
//     if (xhr.status === 403) {
//       const detail = xhr.response.detail;
//       if (detail === "Authentication credentials were not provided.") {
//         if (window.location.href.indexOf("login") === -1) {
//           window.location.href = "/login?showLoginRequired=true";
//         }
//       }
//     }
//     callback(xhr.response, xhr.status);
//   };
//   xhr.onerror = function (e) {
//     callback({ message: "The request was an error" }, 400);
//   };
//   xhr.send(jsonData);
// }

export function Zone() {
  return [
    { label: "(UTC-12:00) International Date Line West", value: "UTC-12:00" },
    { label: "(UTC-11:00) Midway Island, Samoa", value: "UTC-11:00" },
    { label: "(UTC-10:00) Aleutian Islands", value: "UTC-10:00" },
    { label: "(UTC-10:00) Hawaii", value: "UTC-10:00" },
    { label: "(UTC-09:00) Marquesas Island", value: "UTC-09:00" },
    { label: "(UTC-09:00) Alaska", value: "UTC-09:00" },
    {
      label: "(UTC-08:00) Pacific Time (US & Canada)",
      value: "America/Los_Angeles",
    },
    { label: "(UTC-08:00) Tijuana, Baja California", value: "America/Tijuana" },
    { label: "(UTC-07:00) Arizona", value: "US/Arizona" },
    {
      label: "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
      value: "America/Chihuahua",
    },
    { label: "(UTC-07:00) Mountain Time (US & Canada)", value: "US/Mountain" },
    { label: "(UTC-06:00) Central America", value: "America/Managua" },
    { label: "(UTC-06:00) Central Time (US & Canada)", value: "US/Central" },
    {
      label: "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
      value: "America/Mexico_City",
    },
    { label: "(UTC-06:00) Saskatchewan", value: "Canada/Saskatchewan" },
    {
      label: "(UTC-05:00) Bogota, Lima, Quito, Rio Branco",
      value: "America/Bogota",
    },
    { label: "(UTC-05:00) Eastern Time (US & Canada)", value: "US/Eastern" },
    { label: "(UTC-05:00) Indiana (East)", value: "US/East-Indiana" },
    { label: "(UTC-05:00) Haiti", value: "" },
    { label: "(UTC-05:00) Havana", value: "" },
    { label: "(UTC-04:00) Atlantic Time (Canada)", value: "Canada/Atlantic" },
    { label: "(UTC-04:00) Caracas, La Paz", value: "America/Caracas" },
    { label: "(UTC-04:00) Manaus", value: "America/Manaus" },
    { label: "(UTC-04:00) Santiago", value: "America/Santiago" },
    { label: "(UTC-03:30) Newfoundland", value: "Canada/Newfoundland" },
    { label: "(UTC-03:00) Brasilia", value: "America/Sao_Paulo" },
    {
      label: "(UTC-03:00) Buenos Aires, Georgetown",
      value: "America/Argentina/Buenos_Aires",
    },
    { label: "(UTC-03:00) Greenland", value: "America/Godthab" },
    { label: "(UTC-03:00) Montevideo", value: "America/Montevideo" },
    { label: "(UTC-02:00) Mid-Atlantic", value: "America/Noronha" },
    { label: "(UTC-01:00) Cape Verde Is.", value: "Atlantic/Cape_Verde" },
    { label: "(UTC-01:00) Azores", value: "Atlantic/Azores" },
    {
      label: "(UTC+00:00) Casablanca, Monrovia, Reykjavik",
      value: "Africa/Casablanca",
    },
    {
      label:
        "(UTC+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London",
      value: "Etc/Greenwich",
    },
    {
      label: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
      value: "Europe/Amsterdam",
    },
    {
      label: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
      value: "Europe/Belgrade",
    },
    {
      label: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
      value: "Europe/Brussels",
    },
    {
      label: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
      value: "Europe/Sarajevo",
    },
    { label: "(UTC+01:00) West Central Africa", value: "Africa/Lagos" },
    { label: "(UTC+02:00) Amman", value: "Asia/Amman" },
    {
      label: "(UTC+02:00) Athens, Bucharest, Istanbul",
      value: "Europe/Athens",
    },
    { label: "(UTC+02:00) Beirut", value: "Asia/Beirut" },
    { label: "(UTC+02:00) Cairo", value: "Africa/Cairo" },
    { label: "(UTC+02:00) Harare, Pretoria", value: "Africa/Harare" },
    {
      label: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
      value: "Europe/Helsinki",
    },
    { label: "(UTC+02:00) Jerusalem", value: "Asia/Jerusalem" },
    { label: "(UTC+02:00) Minsk", value: "Europe/Minsk" },
    { label: "(UTC+02:00) Windhoek", value: "Africa/Windhoek" },
    { label: "(UTC+03:00) Kuwait, Riyadh, Baghdad", value: "Asia/Kuwait" },
    {
      label: "(UTC+03:00) Moscow, St. Petersburg, Volgograd",
      value: "Europe/Moscow",
    },
    { label: "(UTC+03:00) Nairobi", value: "Africa/Nairobi" },
    { label: "(UTC+03:00) Tbilisi", value: "Asia/Tbilisi" },
    { label: "(UTC+03:30) Tehran", value: "Asia/Tehran" },
    { label: "(UTC+04:00) Abu Dhabi, Muscat", value: "Asia/Muscat" },
    { label: "(UTC+04:00) Baku", value: "Asia/Baku" },
    { label: "(UTC+04:00) Yerevan", value: "Asia/Yerevan" },
    { label: "(UTC+04:30) Kabul", value: "Asia/Kabul" },
    { label: "(UTC+05:00) Yekaterinburg", value: "Asia/Yekaterinburg" },
    {
      label: "(UTC+05:00) Islamabad, Karachi, Tashkent",
      value: "Asia/Karachi",
    },
    {
      label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
      value: "Asia/Calcutta",
    },
    { label: "(UTC+05:30) Sri Jayawardenapura", value: "Asia/Calcutta" },
    { label: "(UTC+05:45) Kathmandu", value: "Asia/Katmandu" },
    { label: "(UTC+06:00) Almaty, Novosibirsk", value: "Asia/Almaty" },
    { label: "(UTC+06:00) Astana, Dhaka", value: "Asia/Dhaka" },
    { label: "(UTC+06:30) Yangon (Rangoon)", value: "Asia/Rangoon" },
    { label: "(UTC+07:00) Bangkok, Hanoi, Jakarta", value: "Asia/Bangkok" },
    { label: "(UTC+07:00) Krasnoyarsk", value: "Asia/Krasnoyarsk" },
    {
      label: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
      value: "Asia/Hong_Kong",
    },
    {
      label: "(UTC+08:00) Kuala Lumpur, Singapore",
      value: "Asia/Kuala_Lumpur",
    },
    { label: "(UTC+08:00) Irkutsk, Ulaan Bataar", value: "Asia/Irkutsk" },
    { label: "(UTC+08:00) Perth", value: "Australia/Perth" },
    { label: "(UTC+08:00) Taipei", value: "Asia/Taipei" },
    { label: "(UTC+09:00) Osaka, Sapporo, Tokyo", value: "Asia/Tokyo" },
    { label: "(UTC+09:00) Seoul", value: "Asia/Seoul" },
    { label: "(UTC+09:00) Yakutsk", value: "Asia/Yakutsk" },
    { label: "(UTC+09:30) Adelaide", value: "Australia/Adelaide" },
    { label: "(UTC+09:30) Darwin", value: "Australia/Darwin" },
    { label: "(UTC+10:00) Brisbane", value: "Australia/Brisbane" },
    {
      label: "(UTC+10:00) Canberra, Melbourne, Sydney",
      value: "Australia/Canberra",
    },
    { label: "(UTC+10:00) Hobart", value: "Australia/Hobart" },
    { label: "(UTC+10:00) Guam, Port Moresby", value: "Pacific/Guam" },
    { label: "(UTC+10:00) Vladivostok", value: "Asia/Vladivostok" },
    {
      label: "(UTC+11:00) Magadan, Solomon Is., New Caledonia",
      value: "Asia/Magadan",
    },
    { label: "(UTC+12:00) Auckland, Wellington", value: "Pacific/Auckland" },
    {
      label: "(UTC+12:00) Fiji, Kamchatka, Marshall Is.",
      value: "Pacific/Fiji",
    },
    { label: "(UTC+13:00) Nuku'alofa", value: "Pacific/Tongatapu" },
  ];
}
