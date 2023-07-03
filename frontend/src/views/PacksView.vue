<template>
  <div
    class="packs"
  >
    <container
      v-if="!isGetPacksLoading"
      class="packs__left"
    >
      <h2 class="packs__left__title">
        Packs ({{ unOpenedPacksCount }})
      </h2>
      <draggable
        v-model="packsToDrag"
        class="packs__left__list"
        :group="{
          name: 'packs',
          pull: !isDropZoneFull,
        }"
        item-key="id"
      >
        <template #item="{element}">
          <pack :id="element.id" />
        </template>
      </draggable>
      <button
        class="packs__left__button nes-btn"
        :class="{
          'is-disabled': profileBalance < 100,
          'is-primary': profileBalance >= 100,
        }"
        :disabled="profileBalance < 100"
        @click="isBuyModalOpen = true"
      >
        Buy Pack (100<i class="nes-icon coin is-small" />)
      </button>
    </container>
    <container
      v-else
      class="packs__left"
    >
      <h2>Packs</h2>
      <span>Loading</span>
    </container>
    <openning
      v-model:isDropZoneFull="isDropZoneFull"
      class="packs__right"
    />
    <modal
      v-model:isOpen="isBuyModalOpen"
      @confirm="purchasePack"
    >
      <template #header>
        <h2>Buy Pack</h2>
      </template>
      <p>A pack contains 5 cards.</p>
      <p>Are you sure you want to buy a pack for 100<i class="nes-icon coin is-small" />?</p>
      <p>Gold remaning after purchase: {{ goldAfterPurchase }}<i class="nes-icon coin is-small" /></p>
      <template #confirm>
        <span>Buy -100<i class="nes-icon coin is-small" /></span>
      </template>
    </modal>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';

import Pack from '@/components/Pack.vue';
import Container from '@/components/Container.vue';
import Modal from '@/components/Modal.vue';
import Openning from '@/components/packs/Openning.vue';

import { usePackStore } from '@/stores/packStore.js';
import { useProfileStore } from '@/stores/profileStore';

import Draggable from 'vuedraggable';

export default {
  name: 'PacksView',
  components: {
    Container,
    Modal,
    Openning,
    Draggable,
    Pack,
  },
  setup() {
    const packStore = usePackStore();
    const profileStore = useProfileStore();
    const isBuyModalOpen = ref(false);
    const isDropZoneFull = ref(false);

    const packsToDrag = ref([]);

    const isGetPacksLoading = computed(() => packStore.isGetPacksLoading);
    const unOpenedPacksCount = computed(() => packStore.unOpenedPacksCount);
    const profileBalance = computed(() => profileStore.profile.balance);
    const goldAfterPurchase = computed(() => profileBalance.value - 100);

    const purchasePack = async () => {
      await packStore.purchasePack();
      packsToDrag.value.unshift(packStore.purchasedPack);
      await profileStore.getProfile();
      isBuyModalOpen.value = false;
    };

    onMounted(async () => {
      await packStore.getPacks();
      packsToDrag.value = packStore.unOpenedPacks;
    });

    return {
      goldAfterPurchase,
      isGetPacksLoading,
      unOpenedPacksCount,
      isBuyModalOpen,
      purchasePack,
      profileBalance,
      packsToDrag,
      isDropZoneFull,
    };
  },
};
</script>

<style lang="scss" scoped>
.packs {
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-areas: "left right";
  grid-template-columns: 300px 1fr;
  grid-template-rows: 100%;
  gap: 1rem;

  &__left {
    display: grid;
    grid-template-areas: "title" "list" "button";
    grid-template-rows: auto 1fr auto;
    gap: 1rem;
    grid-area: left;
    width: 100%;
    height: 100%;

    &__list {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      grid-area: list;
      gap: 1rem;
    }

    &__title {
      margin: 0;
      grid-area: title;
    }

    &__button {
      grid-area: button;
    }

    .card {
      width: 100%;
      object-fit: cover;
      cursor: grab;
    }
  }

  &__right {
    grid-area: right;
    width: 100%;
    height: 100%;
  }
}
</style>
