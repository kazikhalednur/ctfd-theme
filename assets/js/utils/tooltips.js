// Simple tooltip implementation using Alpine.js and Tailwind CSS
export default () => {
  // Tooltips can be handled via Alpine.js or native title attributes
  // For data-bs-toggle="tooltip", we'll use native browser tooltips
  const tooltipList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]'),
  );
  tooltipList.forEach(element => {
    const title =
      element.getAttribute("data-bs-original-title") || element.getAttribute("title");
    if (title) {
      element.setAttribute("title", title);
    }
  });
};
