module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#EB3355",
          100: "#BE1953",
          200: "#771F49",
        },
        primary: {
          100: "#ffffff",
          200: "#FD7E95",
          300: "#F5F5F5",
          400: "#DEE3EA",
          500: "#B2BDCD",
          600: "#5D7290",
          700: "#242C37",
          800: "#151A21",
          900: "#0D1321",
        },
        secondary: {
          900: "#030303",
        },
        transparent: {
          DEFAULT: "rgba(0, 0, 0, 0)",
          100: "rgba(0, 0, 0, 0.1)",
          200: "rgba(0, 0, 0, 0.2)",
          300: "rgba(0, 0, 0, 0.3)",
          400: "rgba(0, 0, 0, 0.4)",
          500: "rgba(0, 0, 0, 0.5)",
          600: "rgba(0, 0, 0, 0.6)",
          700: "rgba(0, 0, 0, 0.7)",
          800: "rgba(0, 0, 0, 0.8)",
          900: "rgba(0, 0, 0, 0.9)",
        },
        thinktank: {
          accent: "#FA0189",
          text: "#B7B7B7",
          button: "#B61A86",
          bg: "#0E041D",
        },
      },
      animation: {
        popup: "popup 1s",
      },
      keyframes: {
        popup: {
          "0%": { transform: "translateY(0px);opacity: 0;" },
          "100%": { transform: "translateY(64px);opacity: 1;" },
        },
      },
      screens: {
        "2md": "970px",
      },
      fontFamily: {
        sans: ["Assistant"],
      },
    },
  },
  plugins: [],
};
