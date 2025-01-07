import { mount } from "@vue/test-utils";
import TaskControls from "@/components/TaskControls.vue";
import { describe, test, expect } from "vitest";

describe("TaskControls", () => {
  test("タスク削除ボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskControls, {
      props: {
        selectedTasksCount: 1,
        tasksPerPage: 5,
        taskDisplayOptions: [5, 10, 20],
      },
    });
    await wrapper.find("button.btn-danger").trigger("click");
    expect(wrapper.emitted().removeSelectedTasks).toBeTruthy();
  });

  test("選択されたタスクをクリアボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskControls, {
      props: {
        selectedTasksCount: 1,
        tasksPerPage: 5,
        taskDisplayOptions: [5, 10, 20],
      },
    });
    await wrapper.find("button.btn-secondary").trigger("click");
    expect(wrapper.emitted().deselectAllTasks).toBeTruthy();
  });
});
