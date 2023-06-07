<template>
  <container
    class="image-upload"
    :class="{
      'image-upload--no-image': !modelValue,
    }"
  >
    <img
      v-if="modelValue"
      class="image-upload__image"
      :src="createObjectURL(modelValue)"
      alt="avatar"
    >
    <img
      v-else
      class="image-upload__image"
      :src="defaultImageUrl"
      alt="avatar"
    >
    <label
      class="nes-btn image-upload__input"
      :class="{
        'image-upload__input--no-image': !modelValue,
      }"
    >
      <span v-if="!modelValue">{{ noFileSelectedText }}</span>
      <span v-else>{{ changeFileSelectedText }}</span>
      <input
        type="file"
        accept="image/*"
        @change="$event.target.files[0] ? $emit('update:modelValue', $event.target.files[0]) : null"
      >
    </label>
    <button
      v-if="modelValue"
      class="nes-btn image-upload__remove is-error"
      @click="$emit('update:modelValue', null)"
    >
      Remove
    </button>
  </container>
</template>

<script>
import Container from '@/components/Container.vue';

export default {
  name: 'ImageUpload',
  components: {
    Container,
  },
  props: {
    modelValue: {
      type: File,
      default: null,
    },
    noFileSelectedText: {
      type: String,
      default: 'Upload an image',
    },
    changeFileSelectedText: {
      type: String,
      default: 'Change image',
    },
    defaultImageUrl: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
  },
  emits: [ 'update:modelValue' ],
  setup() {
    const createObjectURL = (window.URL || window.webkitURL).createObjectURL || window.createObjectURL;

    return {
      createObjectURL,
    };
  },
};
</script>

<style lang="scss" scoped>
.image-upload {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: "image input" "image remove";
  grid-gap: 1rem;

  &--no-image {
    grid-template-areas: "image input" "image input";
  }

  &__image {
    grid-area: image;
    width: 150px;
    height: 150px;
    object-fit: cover;
  }

  &__input {
    grid-area: input;
    align-self: flex-end;

    &--no-image {
      align-self: center;
    }
  }

  &__remove {
    grid-area: remove;
    align-self: flex-start;
  }

  &__input, &__remove {
    justify-self: start;
  }
}
</style>
