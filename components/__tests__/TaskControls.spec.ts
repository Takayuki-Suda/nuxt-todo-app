import { mount } from "@vue/test-utils";
import TaskControls from "@/components/TaskControls.vue";
import { describe, test, expect } from "vitest";
import { useTaskState } from "@/composables/task/useTaskState";

describe("TaskControls", () => {
  const { state, taskDisplayOptions } = useTaskState();

  state.value.selectedTasks = [1]; // 選択されたタスクの数を設定

  const props = {
    selectedTasksCount: state.value.selectedTasks.length,
    tasksPerPage: state.value.tasksPerPage,
    taskDisplayOptions: taskDisplayOptions,
  };

  test("タスク削除ボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskControls, {
      props,
    });
    await wrapper.find("button.btn-danger").trigger("click");
    expect(wrapper.emitted().removeSelectedTasks).toBeTruthy();
  });

  test("選択されたタスクをクリアボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskControls, {
      props,
    });
    await wrapper.find("button.btn-secondary").trigger("click");
    expect(wrapper.emitted().deselectAllTasks).toBeTruthy();
  });
});
