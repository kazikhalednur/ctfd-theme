// Simple clipboard copy with visual feedback
export function copyToClipboard($input) {
  navigator.clipboard.writeText($input.value).then(() => {
    // Create a temporary tooltip-like element
    const originalTitle = $input.getAttribute("title") || "";
    $input.setAttribute("title", "Copied!");

    // Show a simple visual feedback
    const feedback = document.createElement("div");
    feedback.textContent = "Copied!";
    feedback.className = "fixed bg-gray-900 text-white px-3 py-1 rounded text-sm z-50";
    feedback.style.top = `${$input.getBoundingClientRect().top - 30}px`;
    feedback.style.left = `${$input.getBoundingClientRect().left}px`;
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
      $input.setAttribute("title", originalTitle);
    }, 1500);
  });
}
