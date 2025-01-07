import { mount } from "@vue/test-utils";
import TaskInput from "@/components/TaskInput.vue";
import { describe, test, expect } from "vitest";

describe("TaskInput", () => {
  test("入力フィールドが正しくレンダリングされる", () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "",
      },
    });
    expect(wrapper.find("input").exists()).toBe(true);
  });

  test("タスク追加ボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "新しいタスク",
      },
    });
    await wrapper.find("button.btn-primary").trigger("click");
    expect(wrapper.emitted().addTask).toBeTruthy();
  });

  test("入力内容クリアボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskInput, {
      props: {
        modelValue: "新しいタスク",
      },
    });
    await wrapper.find("button.btn-secondary").trigger("click");
    expect(wrapper.emitted().clearInput).toBeTruthy();
  });
});
