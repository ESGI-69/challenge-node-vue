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
          placeholder="Email, product, status, date or sessionId"
        />
      </template>
      <template #default="scope">
        <el-button
          size="small"
          :loading="isUpdateStatusLoading"
          @click="handleCheckStatus(scope.row)"
        >
          Check Status
        </el-button>
        <el-button
          v-if="!scope.row.isCredited"
          size="small"
          type="danger"
          :loading="isCreditPlayerLoading"
          @click="dialogVisible = true, paymentId = scope.row.id"
        >
          Credit
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogVisible"
    title="Warning !"
    width="30%"
  >
    <span>Do you want to credit the player ?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false, paymentId = null">Cancel</el-button>
        <el-button
          type="primary"
          @click="dialogVisible = false, handleCreditPlayer(paymentId), paymentId = null"
        >
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { computed, ref } from 'vue';
import formatDate from '@/utils/formatDate';


import { usePaymentStore } from '@/stores/paymentStore';

export default {
  name: 'AdminPayments',
  setup() {
    const paymentStore = usePaymentStore();

    paymentStore.getPaymentsAdmin();

    const isPaymentsLoading = computed(() => paymentStore.isGetPaymentsAdminLoading);
    const isUpdateStatusLoading = computed(() => paymentStore.isUpdateStatusLoading);
    const isCreditPlayerLoading = computed(() => paymentStore.isCreditPlayerLoading);
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

    const handleCheckStatus = async(row) => {
      await paymentStore.updateStatus(row.id);
      paymentStore.getPaymentsAdmin();

    };

    const dialogVisible = ref(false);
    const paymentId = ref(null);

    const handleCreditPlayer = async(id) =>  {
      await paymentStore.creditPlayer(id);
      paymentStore.getPaymentsAdmin();
    };

    return {
      paymentsFormated,
      isPaymentsLoading,
      search,
      filterTableData,
      handleCheckStatus,
      handleCreditPlayer,
      dialogVisible,
      paymentId,
      isCreditPlayerLoading,
      isUpdateStatusLoading,
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
