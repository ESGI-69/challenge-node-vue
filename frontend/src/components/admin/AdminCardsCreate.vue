<template>
  <div class="admin-cards-create">
    <el-container>
      <el-aside width="300px">
        <card
          v-bind="form"
          :image-edit-url="imageUrl"
          :edit-mode="true"
        />
      </el-aside>
      <el-main>
        <el-form
          ref="formRef"
          v-loading="isPostCardLoading"
          :model="form"
          label-width="120px"
          :rules="rules"
        >
          <el-form-item
            label="Name"
            prop="name"
          >
            <el-input
              v-model="form.name"
              placeholder="Card name"
            />
          </el-form-item>

          <el-form-item
            label="Description"
            prop="description"
          >
            <el-input
              v-model="form.description"
              placeholder="Card description"
            />
          </el-form-item>

          <el-form-item
            label="Type"
            prop="type"
          >
            <el-input
              v-model="form.type"
              placeholder="Card type"
            />
          </el-form-item>

          <el-form-item
            label="Rarity"
            prop="rarity"
          >
            <el-select
              v-model="form.rarity"
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
                  v-model.number="form.cost"
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
                  v-model.number="form.attack"
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
                  v-model.number="form.health"
                  :min="1"
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
              @click="resetForm(formRef)"
            >
              Cancel
            </el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue';

import Card from '../Card.vue';
import { ElMessage } from 'element-plus';

import { useCardStore } from '@/stores/cardStore';

export default {
  name: 'AdminCardsCreate',
  components: {
    Card,
  },
  setup() {
    const cardStore = useCardStore();
    const image = ref(null);
    const formRef = ref();
    const imageUrl = computed(() => image.value?.raw ? URL.createObjectURL(image.value.raw) : null);
    const imageError = ref(false);
    const formError = ref(false);
    const form = reactive({
      cost: 0,
      name: '',
      rarity: 'common',
      description: '',
      type: '',
      attack: 1,
      health: 1,
    });
    const selectImage = (file) => image.value = file;
    const isPostCardLoading = computed(() => cardStore.isPostCardLoading);

    const submitForm = async (formEl) => {
      if (!formEl) return;
      await formEl.validate(async (valid) => {
        imageError.value = !image.value ? true : false;
        if (valid) {
          formError.value = false;
          if (!imageError.value) {
            await cardStore.postCard({
              ...form,
              image: image.value.raw,
            });
            formEl.resetFields();
            selectImage(null);
            ElMessage.success('Card created successfully');
          }
        } else {
          formError.value = true;
        }
      });
    };

    const resetForm = (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
      selectImage(null);
      formError.value = false;
      imageError.value = false;
    };

    const rules = reactive({
      name: [ { required: true, min: 1, message: 'Please input the name of the card', trigger: 'blur' } ],
      description: [ { required: true, message: 'Please input the description of the card', trigger: 'blur' } ],
      type: [ { required: true, message: 'Please input the type of the card', trigger: 'blur' } ],
      health: [ { required: true, message: 'Please input the health of the card', trigger: 'blur' } ],
      attack: [ { required: true, message: 'Please input the attack of the card', trigger: 'blur' } ],
    });

    return {
      form,
      selectImage,
      imageUrl,
      rules,
      submitForm,
      formRef,
      resetForm,
      isPostCardLoading,
      imageError,
      formError,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
  flex-direction: row;
  &__error-image {
    position: absolute;
  }
}
</style>
