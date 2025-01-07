import { mount } from "@vue/test-utils";
import Pagination from "@/components/Pagination.vue";
import { describe, test, expect } from "vitest";

describe("Pagination", () => {
  const props = {
    currentPage: 1,
    totalPages: 5,
  };

  test("ページネーションが正しくレンダリングされる", () => {
    const wrapper = mount(Pagination, {
      props,
    });
    expect(wrapper.findAll(".page-item").length).toBe(props.totalPages + 2); // 前へ、次へボタンを含む
  });

  test("前へボタンが正しく動作する", async () => {
    const wrapper = mount(Pagination, {
      props,
    });
    await wrapper.find(".page-item:first-child .page-link").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("changePage");
    expect(wrapper.emitted().changePage[0]).toEqual([props.currentPage - 1]);
  });

  test("次へボタンが正しく動作する", async () => {
    const wrapper = mount(Pagination, {
      props,
    });
    await wrapper.find(".page-item:last-child .page-link").trigger("click");
    expect(wrapper.emitted()).toHaveProperty("changePage");
    expect(wrapper.emitted().changePage[0]).toEqual([props.currentPage + 1]);
  });

  test("ページ番号ボタンが正しく動作する", async () => {
    const wrapper = mount(Pagination, {
      props,
    });
    const pageButtons = wrapper.findAll(".page-item .page-link");
    await pageButtons[2].trigger("click"); // 2番目のページボタンをクリック
    expect(wrapper.emitted()).toHaveProperty("changePage");
    expect(wrapper.emitted().changePage[0]).toEqual([2]);
  });
});
