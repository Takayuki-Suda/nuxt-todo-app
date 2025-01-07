import { mount } from "@vue/test-utils";
import TaskDetailsModal from "@/components/TaskDetailsModal.vue";
import { describe, test, expect } from "vitest";

describe("TaskDetailsModal", () => {
  const task = {
    text: "テストタスク",
    details: "タスクの詳細",
    completed: false,
    dueDate: new Date().toISOString(),
  };

  test("タスク詳細モーダルが正しくレンダリングされる", () => {
    const wrapper = mount(TaskDetailsModal, {
      props: {
        task,
      },
    });
    expect(wrapper.find(".modal-title").text()).toBe("タスク詳細");
  });

  test("閉じるボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskDetailsModal, {
      props: {
        task,
      },
    });
    await wrapper.find("button.btn-close").trigger("click");
    expect(wrapper.emitted().close).toBeTruthy();
  });

  test("編集ボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(TaskDetailsModal, {
      props: {
        task,
      },
    });
    await wrapper.find("button.btn-primary").trigger("click");
    expect(wrapper.emitted().editTask).toBeTruthy();
  });
});
