module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "light",
      {
        mytheme: {
          primary: "#4990bc",
          secondary: "#431efc",
          accent: " #cff4a1",
          neutral: "#2c2a3c",
          "base-100": "#36344c",
          info: "#6f9ad8",
          success: "#22c39e",
          warning: "#cca90f",
          error: "#e86d90",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
