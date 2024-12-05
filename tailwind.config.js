/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#FFEC0C",
        secondary_1: "#2F0C79",
        secondary_2: "#A033CD",
        secondary_3: "#E2000E",
      },
      fontFamily: {
        karate: "Karate",
        glegoo: "Glegoo",
        exo: "Exo",
        noto_serif: "Noto Serif",
        lastica: "Lastica",
      },
      backgroundColor: {
        header: "#221E1F",
        cardInfo: "#E6E6E6",
      },
      borderColor: {
        card: "#E2060F",
        header: "#221E1F",
      },
      backgroundImage: {
        "marco-amarillo":
          "url('https://puntokoreano.com/images/marcos/marco-amarillo.png')",
        "marco-morado":
          "url('https://puntokoreano.com/images/marcos/marco-morado.png')",
      },
    },
  },
  plugins: [],
};
