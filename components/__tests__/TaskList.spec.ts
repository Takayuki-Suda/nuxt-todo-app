import { mount } from "@vue/test-utils";
import TaskList from "@/components/TaskList.vue";
import { describe, test, expect } from "vitest";

describe("TaskList", () => {
  const tasks = [
    {
      id: 1,
      name: "Task 1",
      dueDate: "2023-12-01",
      completed: false,
      order: 0,
    },
    { id: 2, name: "Task 2", dueDate: "2023-12-05", completed: true, order: 1 },
  ];

  const props = {
    state: {
      currentPage: 1,
      tasksPerPage: 5,
      selectedTasks: [],
      tasks: tasks,
      paginatedTasks: tasks,
    },
    draggedTaskIndex: null,
    draggingTaskIndex: null,
    dragDirection: null,
    taskDisplayOptions: [5, 10, 20],
  };

  test("タスクリストが正しくレンダリングされる", () => {
    const wrapper = mount(TaskList, {
      props: {
        state: props.state,
        paginatedTasks: props.state.paginatedTasks,
        draggedTaskIndex: props.draggedTaskIndex,
        draggingTaskIndex: props.draggingTaskIndex,
        dragDirection: props.dragDirection,
        tasksPerPage: props.state.tasksPerPage,
        taskDisplayOptions: props.taskDisplayOptions,
      },
    });
    expect(wrapper.findAll(".list-group-item").length).toBe(tasks.length);
  });

  test("タスクの緊急度ラベルが正しく表示される", () => {
    const wrapper = mount(TaskList, {
      props: {
        state: props.state,
        paginatedTasks: props.state.paginatedTasks,
        draggedTaskIndex: props.draggedTaskIndex,
        draggingTaskIndex: props.draggingTaskIndex,
        dragDirection: props.dragDirection,
        tasksPerPage: props.state.tasksPerPage,
        taskDisplayOptions: props.taskDisplayOptions,
      },
    });
    const taskItems = wrapper.findAll(".list-group-item");
    expect(taskItems[0].text()).toContain("遅延");
    expect(taskItems[1].text()).toContain("終了");
  });

  test("タスクをドラッグアンドドロップできる", async () => {
    const wrapper = mount(TaskList, {
      props: {
        state: props.state,
        paginatedTasks: props.state.paginatedTasks,
        draggedTaskIndex: props.draggedTaskIndex,
        draggingTaskIndex: props.draggingTaskIndex,
        dragDirection: props.dragDirection,
        tasksPerPage: props.state.tasksPerPage,
        taskDisplayOptions: props.taskDisplayOptions,
      },
    });
    const taskItems = wrapper.findAll(".list-group-item");
    await taskItems[0].trigger("dragstart");
    await taskItems[1].trigger("dragover");
    await taskItems[1].trigger("drop");
    await taskItems[1].trigger("dragend");
    expect(wrapper.emitted()).toHaveProperty("drop");
  });
});
