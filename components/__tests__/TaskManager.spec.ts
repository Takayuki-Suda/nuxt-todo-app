import { mount } from "@vue/test-utils";
import TaskManager from "@/components/TaskManager.vue";
import { describe, test, expect } from "vitest";

describe("TaskManager", () => {
  const props = {
    task: null,
  };

  test("TaskManagerが正しくレンダリングされる", () => {
    const wrapper = mount(TaskManager, {
      props,
      emits: ["add-task", "change-page"],
    });
    expect(wrapper.find(".task-container").exists()).toBe(true);
  });

  test("タスク追加ボタンが正しく動作する", async () => {
    const wrapper = mount(TaskManager, {
      props,
      emits: ["add-task", "change-page"],
    });
    await wrapper.findComponent({ name: "TaskInput" }).vm.$emit("add-task");
    expect(wrapper.vm.taskState.state.newTask).toBe("");
  });

  test("タスク削除ボタンが正しく動作する", async () => {
    const wrapper = mount(TaskManager, {
      props,
      emits: ["add-task", "change-page"],
    });
    await wrapper
      .findComponent({ name: "TaskControls" })
      .vm.$emit("removeSelectedTasks");
    expect(wrapper.vm.taskState.state.selectedTasks.length).toBe(0);
  });

  test("ページネーションが正しく動作する", async () => {
    const wrapper = mount(TaskManager, {
      props,
      emits: ["add-task", "change-page"],
    });
    await wrapper
      .findComponent({ name: "Pagination" })
      .vm.$emit("change-page", 2);
    expect(wrapper.vm.taskState.state.currentPage).toBe(2);
  });
});
