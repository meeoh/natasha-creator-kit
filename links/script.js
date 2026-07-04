function showEmailToast(message = "Email copied") {
  let toast = document.querySelector(".email-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "email-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showEmailToast.timeout);
  showEmailToast.timeout = setTimeout(() => toast.classList.remove("show"), 1800);
}

async function copyEmailToClipboard(email) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(email);
    return true;
  }

  return false;
}

function setupEmailFeedback() {
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", () => {
      const email = decodeURIComponent(link.getAttribute("href").replace(/^mailto:/, "").split("?")[0]);
      const label = link.querySelector("strong");
      const originalLabel = label?.textContent;

      copyEmailToClipboard(email)
        .then((copied) => {
          showEmailToast(copied ? "Email copied" : email);
          if (copied && label) {
            label.textContent = "Email copied";
            setTimeout(() => { label.textContent = originalLabel; }, 1600);
          }
        })
        .catch(() => showEmailToast(email));
    });
  });
}

setupEmailFeedback();
