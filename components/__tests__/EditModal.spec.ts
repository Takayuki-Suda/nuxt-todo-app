import { mount } from "@vue/test-utils";
import EditModal from "@/components/EditModal.vue";
import { describe, test, expect } from "vitest";

describe("EditModal", () => {
  const task = {
    text: "テストタスク",
    details: "タスクの詳細",
    completed: false,
    dueDate: new Date().toISOString(),
  };

  test("編集モーダルが正しくレンダリングされる", () => {
    const wrapper = mount(EditModal, {
      props: {
        isEditModalVisible: true,
        currentEditTask: task,
      },
    });
    expect(wrapper.find(".modal-title").text()).toBe("タスクを編集");
  });

  test("閉じるボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(EditModal, {
      props: {
        isEditModalVisible: true,
        currentEditTask: task,
      },
    });
    await wrapper.find("button.btn-close").trigger("click");
    expect(wrapper.emitted().closeEditModal).toBeTruthy();
  });

  test("保存ボタンがクリックされたときにイベントが発火する", async () => {
    const wrapper = mount(EditModal, {
      props: {
        isEditModalVisible: true,
        currentEditTask: task,
      },
    });
    await wrapper.find("button.btn-primary").trigger("click");
    expect(wrapper.emitted().saveEditTask).toBeTruthy();
  });
});
