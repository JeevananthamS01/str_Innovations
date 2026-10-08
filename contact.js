console.log("CONTACT JS LOADED");


const contactForm = document.querySelector("#contactForm");

if (contactForm) {
  const nameInput = contactForm.querySelector('[name="name"]');
  const companyInput = contactForm.querySelector('[name="company"]');
  const emailInput = contactForm.querySelector('[name="email"]');
  const phoneInput = contactForm.querySelector('[name="phone"]');
  const messageInput = contactForm.querySelector('[name="message"]');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, "");
  });

  companyInput.addEventListener("input", () => {
    companyInput.value = companyInput.value.replace(/[^a-zA-Z\s&.,'-]/g, "");
  });

  phoneInput.addEventListener("input", () => {
    let value = phoneInput.value.replace(/[^\d+]/g, "");

    if (value.includes("+")) {
      value = "+" + value.replace(/\+/g, "");
    }

    const digits = value.replace(/\D/g, "");

    if (digits.length > 15) {
      value = value.startsWith("+")
        ? "+" + digits.substring(0, 15)
        : digits.substring(0, 15);
    }

    phoneInput.value = value;
  });

  emailInput.addEventListener("input", () => {
    emailInput.value = emailInput.value.replace(/\s/g, "");
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const company = companyInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      showFormMessage("Please enter your name.", "error");
      nameInput.focus();
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      showFormMessage("Name should contain letters and spaces only.", "error");
      nameInput.focus();
      return;
    }

    if (company && !/^[a-zA-Z\s&.,'-]+$/.test(company)) {
      showFormMessage("Company name should not contain numbers.", "error");
      companyInput.focus();
      return;
    }

    if (!email) {
      showFormMessage("Please enter your email address.", "error");
      emailInput.focus();
      return;
    }

    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailPattern.test(email)) {
      showFormMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    if (!phone) {
      showFormMessage("Please enter your phone number.", "error");
      phoneInput.focus();
      return;
    }

    if (!/^\+?\d+$/.test(phone)) {
      showFormMessage("Phone number should contain numbers only.", "error");
      phoneInput.focus();
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      showFormMessage("Please enter a valid phone number.", "error");
      phoneInput.focus();
      return;
    }

    if (!message) {
      showFormMessage("Please enter your requirement.", "error");
      messageInput.focus();
      return;
    }

    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbx89RYI6NzjV888jvmN0oR9FCOBZUvigPSpCWvlVfml6oMb1QKqVXb3cTl_XvUoWJODtw/exec";

    const originalButtonHTML = submitButton.innerHTML;

    submitButton.disabled = true;

    submitButton.innerHTML = `
      Sending...
      <span>↗</span>
    `;

    try {
      const formData = new URLSearchParams();

      formData.append("name", name);
      formData.append("company", company);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("message", message);

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      showFormMessage(
        "Thank you! Your enquiry has been submitted successfully.",
        "success",
      );

      contactForm.reset();
    } catch (error) {
      console.error("Contact form error:", error);

      showFormMessage(
        "Unable to submit your enquiry. Please try again.",
        "error",
      );
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  });
}

function showFormMessage(message, type) {
  let messageBox = document.querySelector(".form-message");

  if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.className = "form-message";

    const form = document.querySelector("#contactForm");

    if (form) {
      form.appendChild(messageBox);
    }
  }

  messageBox.textContent = message;
  messageBox.className = `form-message ${type}`;

  setTimeout(() => {
    if (messageBox) {
      messageBox.textContent = "";
      messageBox.className = "form-message";
    }
  }, 5000);
}
