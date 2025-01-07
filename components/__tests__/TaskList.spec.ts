import { mount } from "@vue/test-utils";
import TaskList from "@/components/TaskList.vue";
import { describe, test, expect } from "vitest";
import { useTaskState } from "@/composables/task/useTaskState";

describe("TaskList", () => {
  const { state, taskDisplayOptions } = useTaskState();

  state.value.tasks = [
    {
      id: 1,
      text: "Task 1",
      dueDate: "2023-12-01",
      completed: false,
      details: null,
      order: 0,
    },
    {
      id: 2,
      text: "Task 2",
      dueDate: "2023-12-05",
      completed: true,
      details: null,
      order: 1,
    },
  ];
  state.value.paginatedTasks = state.value.tasks;

  const props = {
    state: state.value,
    paginatedTasks: state.value.paginatedTasks,
    draggedTaskIndex: null,
    draggingTaskIndex: null,
    dragDirection: null,
    tasksPerPage: state.value.tasksPerPage, // ここを追加
    taskDisplayOptions: taskDisplayOptions,
  };

  test("タスクリストが正しくレンダリングされる", () => {
    const wrapper = mount(TaskList, {
      props,
    });
    expect(wrapper.findAll(".list-group-item").length).toBe(
      state.value.tasks.length
    );
  });

  test("タスクの緊急度ラベルが正しく表示される", () => {
    const wrapper = mount(TaskList, {
      props,
    });
    const taskItems = wrapper.findAll(".list-group-item");
    expect(taskItems[0].text()).toContain("遅延");
    expect(taskItems[1].text()).toContain("終了");
  });

  test("タスクをドラッグアンドドロップできる", async () => {
    const wrapper = mount(TaskList, {
      props,
    });
    const taskItems = wrapper.findAll(".list-group-item");
    await taskItems[0].trigger("dragstart");
    await taskItems[1].trigger("dragover");
    await taskItems[1].trigger("drop");
    await taskItems[1].trigger("dragend");
    expect(wrapper.emitted()).toHaveProperty("drop");
  });
});
