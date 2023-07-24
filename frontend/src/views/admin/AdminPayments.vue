<template>
  <el-table
    v-loading="isPaymentsLoading"
    :data="filterTableData"
    height="75vh"
    style="width: 100%"
    stripe
    :default-sort="{ prop: 'createdAt', order: 'descending' }"
  >
    <el-table-column
      prop="createdAt"
      label="Date"
      sortable
    />

    <el-table-column
      prop="product.name"
      label="Product"
    />

    <el-table-column
      prop="user.email"
      label="User"
    />

    <el-table-column
      prop="isCredited"
      label="Credited"
      width="100"
    />

    <el-table-column
      label="Status"
    >
      <template #default="scope">
        <el-text
          class="mx-1"
          :type="{
            PAID: 'success',
            PENDING: 'warning',
            CANCELED: 'danger',
          }[scope.row.status]"
        >
          {{ scope.row.status }}
        </el-text>
      </template>
    </el-table-column>

    <el-table-column
      prop="sessionId"
      label="Session ID"
      width="300"
    />

    <el-table-column align="right">
      <template #header>
        <el-input
          v-model="search"
          size="small"
          placeholder="Type to search"
        />
      </template>
      <template #default="scope">
        <el-button
          size="small"
          @click="handleCheckStatus(scope.$index, scope.row)"
        >
          Check Status
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { computed, ref } from 'vue';
import formatDate from '@/utils/formatDate';

import { usePaymentStore } from '@/stores/paymentStore';
import { useProductStore } from '@/stores/productStore';
import { useUserStore } from '@/stores/userStore';

export default {
  name: 'AdminPayments',
  setup() {
    const paymentStore = usePaymentStore();
    const productStore = useProductStore();
    const userStore = useUserStore();

    paymentStore.getPaymentsAdmin();
    userStore.getUsers();
    productStore.getProducts();

    const isPaymentsLoading = computed(() => paymentStore.isGetPaymentsAdminLoading);
    const payments = computed(() => paymentStore.paymentsAdmin);

    const paymentsFormated = computed(() => {
      const paymentsFormated = [];
      payments.value.forEach((payment) => {
        const paymentFormated = {
          ...payment,
          createdAt: formatDate(payment.createdAt),
        };
        paymentsFormated.push(paymentFormated);
      });
      return paymentsFormated;
    });

    const search = ref('');

    const filterTableData = computed(() =>
      paymentsFormated.value.filter(
        (data) =>
          !search.value ||
          data.user.email.toLowerCase().includes(search.value.toLowerCase()) ||
          data.product.name.toLowerCase().includes(search.value.toLowerCase()) ||
          data.status.toLowerCase().includes(search.value.toLowerCase()) ||
          data.createdAt.toLowerCase().includes(search.value.toLowerCase()) ||
          data.sessionId.toLowerCase().includes(search.value.toLowerCase()),
      ),
    );

    const handleCheckStatus = (index, row) => {
      console.log(index, row);
    };
    const handleDelete = (index, row) => {
      console.log(index, row);
    };

    return {
      paymentsFormated,
      isPaymentsLoading,
      search,
      filterTableData,
      handleCheckStatus,
      handleDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
.payment-success-row {
  .status-column {
    color: #67C23A;
  }
}

.payment-warning-row {
  .status-column {
    color: #E6A23C;
  }
}

.payment-danger-row {
  .status-column {
    color: #F56C6C;
  }
}
</style>
