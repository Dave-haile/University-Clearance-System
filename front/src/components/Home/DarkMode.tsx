const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}
const DarkMode = () => {
  return (
    <button
      onClick={() => {
        const root = document.documentElement;
        const isDarkMode = root.classList.toggle("dark");
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      }}
      className="bg-transparent border-none p-2 bg-gray-200 text-black dark:bg-gray-800 rounded"
    >
      <input type="checkbox" name="" id="" />
    </button>
  );
};

export default DarkMode;
