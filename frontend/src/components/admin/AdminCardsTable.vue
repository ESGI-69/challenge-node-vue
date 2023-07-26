<template>
  <div class="admin-cards-overview">
    <el-table
      v-loading="isCardsLoading"
      :data="filterTableData"
      height="75vh"
      style="width: 100%"
      stripe
      :default-sort="{ prop: 'id', order: 'ascending' }"
    >
      <el-table-column
        prop="id"
        label="ID"
        sortable
        width="100"
      />
      <el-table-column
        prop="name"
        label="Name"
        sortable
      />

      <el-table-column
        prop="description"
        label="Description"
        width="300"
      />

      <el-table-column
        prop="type"
        label="Type"
        sortable
      />

      <el-table-column
        prop="rarity"
        label="Rarity"
        sortable
      />

      <el-table-column
        prop="cost"
        label="Cost"
        sortable
        width="100"
      />

      <el-table-column
        prop="attack"
        label="Attack"
        sortable
        width="100"
      />

      <el-table-column
        prop="health"
        label="Health"
        sortable
        width="100"
      />

      <el-table-column
        label="Actions"
      >
        <template #header>
          <el-input
            v-model="search"
            size="small"
            placeholder="Search"
          />
        </template>
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit(scope.row)"
          >
            Edit
          </el-button>
          <el-button
            size="small"
            type="danger"
            :loading="isDeleteCardLoading"
            @click="handleDelete(scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      v-model="drawer"
      direction="rtl"
      size="50%"
    >
      <template #header>
        <h4>
          Edit card
          <span v-if="currentCardEdit"> {{ currentCardEdit.name }} - ID {{ currentCardEdit.id }}
          </span>
        </h4>
      </template>
      <template #default>
        <div class="card-display">
          <card
            v-bind="currentCardEdit"
            :image-edit-url="imageUrl"
            :edit-mode="editMode"
          />
        </div>
        <el-form
          v-loading="isPatchCardLoading"
          :model="currentCardEdit"
          label-width="120px"
          :rules="rules"
          label-position="top"
        >
          <el-form-item
            label="Name"
            prop="name"
          >
            <el-input
              v-model="currentCardEdit.name"
              placeholder="Card name"
            />
          </el-form-item>

          <el-form-item
            label="Description"
            prop="description"
          >
            <el-input
              v-model="currentCardEdit.description"
              placeholder="Card description"
            />
          </el-form-item>

          <el-form-item
            label="Type"
            prop="type"
          >
            <el-input
              v-model="currentCardEdit.type"
              placeholder="Card type"
            />
          </el-form-item>

          <el-form-item
            label="Rarity"
            prop="rarity"
          >
            <el-select
              v-model="currentCardEdit.rarity"
              placeholder="Select a rarity"
            >
              <el-option
                v-for="item in ['common', 'rare', 'epic', 'legendary']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>

          <div class="form-container">
            <div class="form-container__left">
              <el-form-item
                label="Cost"
                prop="cost"
              >
                <el-input-number
                  v-model.number="currentCardEdit.cost"
                  :min="0"
                  :max="10"
                  :step="1"
                />
              </el-form-item>

              <el-form-item
                label="Attack"
                prop="attack"
              >
                <el-input-number
                  v-model.number="currentCardEdit.attack"
                  :min="1"
                  :max="10"
                  :step="1"
                />
              </el-form-item>

              <el-form-item
                label="Health"
                prop="health"
              >
                <el-input-number
                  v-model.number="currentCardEdit.health"
                  :min="0"
                  :max="10"
                  :step="1"
                />
              </el-form-item>
            </div>
            <div class="form-container__right">
              <el-form-item>
                <el-upload
                  class="upload-demo"
                  drag
                  :auto-upload="false"
                  :show-file-list="false"
                  :accept="'image/*'"
                  @change="selectImage"
                >
                  <el-icon class="el-icon--upload">
                    <upload-filled />
                  </el-icon>
                  <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      Image files with a size less than 10MB
                    </div>
                    <el-text
                      v-if="imageError"
                      type="danger"
                      class="form-container__error-image"
                    >
                      Please select an image
                    </el-text>
                  </template>
                </el-upload>
              </el-form-item>
            </div>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm(formRef)"
            >
              Create
            </el-button>
            <el-button
              type="danger"
              @click="resetForm()"
            >
              Cancel
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
    <el-dialog
      v-model="dialogVisible"
      title="Delete card"
      width="30%"
    >
      <span>
        Are you sure you want to delete card
      </span>
      <span
        v-if="currentCard"
        class="strong"
      >
        {{ currentCard.name }}
      </span>
      <span>
        ?
      </span>
      <template #footer>
        <el-button
          @click="dialogVisible = false, currentCard = null"
        >
          Cancel
        </el-button>
        <el-button
          type="danger"
          @click="handleDeleteCard()"
        >
          Delete
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { computed, ref, reactive } from 'vue';
import { useCardStore } from '@/stores/cardStore';
import { ElMessage } from 'element-plus';
import Card from '../Card.vue';


export default {
  name: 'AdminCardsTable',
  components: {
    Card,
  },
  setup() {
    const search = ref('');
    const dialogVisible = ref(false);
    const cardStore = useCardStore();
    const isCardsLoading = computed(() => cardStore.isCardLoading);
    const isDeleteCardLoading = computed(() => cardStore.isDeleteCardLoading);
    const cards = computed(() => cardStore.cards);
    const currentCard = ref(null);
    const image = ref(null);
    const imageUrl = computed(() => image.value?.raw ? URL.createObjectURL(image.value.raw) : null);
    const selectImage = (file) => image.value = file;
    const imageError = ref(false);
    const isPatchCardLoading = computed(() => cardStore.isPatchCardLoading);
    const currentCardEdit = reactive({});
    const drawer = ref(false);
    const editMode = computed(() =>{
      if (image.value) {
        return true;
      }
      return false;

    });

    cardStore.getCards();

    const filterTableData = computed (() =>
      cards.value.filter(
        (data) =>
          !search.value ||
        data.name.toLowerCase().includes(search.value.toLowerCase()) ||
        data.description.toLowerCase().includes(search.value.toLowerCase()) ||
        data.type?.toLowerCase().includes(search.value.toLowerCase()) ||
        data.rarity.toLowerCase().includes(search.value.toLowerCase()) ||
        data.cost.toString().includes(search.value.toLowerCase()) ||
        data.attack?.toString().includes(search.value.toLowerCase()) ||
        data.health?.toString().includes(search.value.toLowerCase()),
      ),
    );

    const handleDelete = (card) => {
      currentCard.value = card;
      dialogVisible.value = true;
    };

    const handleDeleteCard = async() => {
      dialogVisible.value = false;
      await cardStore.deleteCard(currentCard.value.id);
      currentCard.value = null;
      cardStore.getCards();
      ElMessage.success('Card deleted');
    };

    const handleEdit = (card) => {
      drawer.value = true;
      currentCardEdit.id = card.id;
      currentCardEdit.name = card.name;
      currentCardEdit.description = card.description;
      currentCardEdit.type = card.type;
      currentCardEdit.rarity = card.rarity;
      currentCardEdit.cost = card.cost;
      currentCardEdit.attack = card.attack;
      currentCardEdit.health = card.health;
    };

    const confirmDrawerClick = () => {
      drawer.value = false;
      currentCardEdit.value = null;
    };

    const cancelDrawerClick = () => {
      drawer.value = false;
      currentCardEdit.value = null;
      image.value = null;
    };

    const rules = reactive({
      name: [ { required: true, min: 1, message: 'Please input the name of the card', trigger: 'blur' } ],
      description: [ { required: true, message: 'Please input the description of the card', trigger: 'blur' } ],
      type: [ { required: true, message: 'Please input the type of the card', trigger: 'blur' } ],
    });

    const submitForm = async(formEl) => {
      if (!formEl) return;
      await formEl.validate(async (valid) => {
        if (valid) {
          // continue here
        }
      });

    };

    const resetForm = () => {
      cancelDrawerClick();
    };

    return {
      isCardsLoading,
      filterTableData,
      search,
      dialogVisible,
      handleDelete,
      handleDeleteCard,
      isDeleteCardLoading,
      currentCard,
      drawer,
      handleEdit,
      currentCardEdit,
      confirmDrawerClick,
      cancelDrawerClick,
      rules,
      imageUrl,
      selectImage,
      imageError,
      isPatchCardLoading,
      resetForm,
      image,
      editMode,
    };
  },
};
</script>

<style lang="scss" scoped>
.admin-cards-overview {
  .strong {
    font-weight: bold;
  }
  .form-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    &__error-image {
      position: absolute;
    }
  }
  .card-display {
    position: fixed;
    left: 1rem;
    padding: 1rem;
    background-color: #7f7f7f;
  }
}
</style>
