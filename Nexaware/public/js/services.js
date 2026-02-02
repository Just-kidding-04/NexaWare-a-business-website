
  const openBtn = document.getElementById("openEnquiry");
  const template = document.getElementById("model-template");
  let modalInstance = null;

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (modalInstance) return;

    modalInstance = template.content.cloneNode(true);
    document.body.appendChild(modalInstance);

    const modal = document.getElementById("modal");
    const closeBtn = modal.querySelector(".close-btn");

    closeBtn.onclick = closeModal;

    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  });

  function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) modal.remove();
    modalInstance = null;
  }
