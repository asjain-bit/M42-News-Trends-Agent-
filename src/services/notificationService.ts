export const notificationService = {
  notify: (message: string, type: "success" | "error" | "info" = "info") => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("m42-notify", { detail: { message, type } });
      window.dispatchEvent(event);
    }
  }
};
