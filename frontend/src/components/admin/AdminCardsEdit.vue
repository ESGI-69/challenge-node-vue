<template>
  <div class="admin-cards-edit">
    <el-container>
      <el-aside width="300px">
        <card
          v-bind="form"
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

          <!-- <image-upload
            v-model="avatar"
            :no-file-selected-text="'Upload your avatar'"
            :change-file-selected-text="'Change your avatar'"
            :default-image-url="profileAvatar"
          /> -->
        </el-form>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive } from 'vue';

import Card from '../Card.vue';
import ImageUpload from '@/views/ImageUpload.vue';

export default {
  name: 'AdminCardsEdit',
  components: {
    Card,
    ImageUpload,
  },
  setup() {
    const form = reactive({
      cost: 0,
      name: '',
      rarity: 'common',
      description: '',
      type: '',
      attack: 1,
      health: 0,
    });
    return {
      form,
    };
  },
};
</script>
