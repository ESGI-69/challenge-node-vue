<template>
  <div class="admin-cards-edit">
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
          :model="form"
          label-width="120px"
        >
          <el-form-item label="Name">
            <el-input
              v-model="form.name"
              placeholder="Card name"
            />
          </el-form-item>
          <el-form-item label="Description">
            <el-input
              v-model="form.description"
              placeholder="Card description"
            />
          </el-form-item>
          <el-form-item label="Rarity">
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
          <el-form-item label="Cost">
            <el-input-number
              v-model.number="form.cost"
              :min="0"
              :max="10"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="Type">
            <el-input
              v-model="form.type"
              placeholder="Card type"
            />
          </el-form-item>
          <el-form-item label="Attack">
            <el-input-number
              v-model.number="form.attack"
              :min="1"
              :max="10"
              :step="1"
            />
          </el-form-item>
          <el-form-item label="Health">
            <el-input-number
              v-model.number="form.health"
              :min="0"
              :max="10"
              :step="1"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
            >
              Create
            </el-button>
            <el-button
              type="danger"
              @click="onCancel"
            >
              Cancel
            </el-button>
          </el-form-item>

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
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue';

import Card from '../Card.vue';

export default {
  name: 'AdminCardsEdit',
  components: {
    Card,
  },
  setup() {
    const image = ref(null);
    const imageUrl = computed(() => image.value?.raw ? URL.createObjectURL(image.value.raw) : null);
    const form = reactive({
      cost: 0,
      name: '',
      rarity: 'common',
      description: '',
      type: '',
      attack: 1,
      health: 0,
    });
    const selectImage = (file) => image.value = file;
    return {
      form,
      selectImage,
      imageUrl,
    };
  },
};
</script>
