<template>
  <div class="table-pagination">
    <button
      v-if="totalPages > 1"
      :disabled="currentPage === 1"
      class="nes-btn cards-table__footer__pagination__button"
      :class="{ 'is-disabled': currentPage === 1 }"
      @click="previousPage()"
    >
      Previous
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      :class="{ 'is-primary': page === currentPage }"
      class="nes-btn cards-table__footer__pagination__button"
      @click="changePage(page)"
    >
      {{ page }}
    </button>
    <button
      v-if="totalPages > 1"
      :disabled="currentPage === totalPages"
      class="nes-btn cards-table__footer__pagination__button"
      :class="{ 'is-disabled': currentPage === totalPages }"
      @click="nextPage()"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: 'TablePagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'change',
    'next',
    'previous',
  ],
  setup(props, { emit }) {
    const changePage = (page) => {
      emit('change', page);
    };

    const nextPage = () => {
      emit('next');
    };

    const previousPage = () => {
      emit('previous');
    };

    return {
      changePage,
      nextPage,
      previousPage,
    };
  },
};
</script>

<style lang="scss" scoped>
.table-pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
