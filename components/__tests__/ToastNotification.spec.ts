import { mount } from "@vue/test-utils";
import ToastNotification from "@/components/ToastNotification.vue";
import { describe, test, expect } from "vitest";

describe("ToastNotification", () => {
  const props = {
    showToast: true,
    toastType: "alert-success",
    toastMessage: "テストメッセージ",
  };

  test("トーストが正しくレンダリングされる", () => {
    const wrapper = mount(ToastNotification, {
      props,
    });
    expect(wrapper.find(".toast").exists()).toBe(true);
    expect(wrapper.find(".toast").classes()).toContain(props.toastType);
    expect(wrapper.find(".toast-header strong").text()).toBe(
      props.toastMessage
    );
  });

  test("閉じるボタンが正しく動作する", async () => {
    const wrapper = mount(ToastNotification, {
      props,
    });
    await wrapper.find(".btn-close").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("close");
  });
});
