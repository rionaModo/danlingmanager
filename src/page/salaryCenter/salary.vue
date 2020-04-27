<template>
    <div class="saray">
      <el-card class="box-header">
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="活动名称">
                  <el-date-picker
                    format="yyyy年MM月"
                    value-format="yyyyMM"
                    v-model="form.date"
                    type="month"
                    placeholder="选择月">
                  </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="primary" @click="onSubmit">导出</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="box-content">
        <div class="content-table">
          <el-table
            :data="listData.data"
            stripe
            style="width: 100%">
            <el-table-column
              prop="id"
              label="序号"
              width="80">
            </el-table-column>
            <el-table-column
              prop="dpk_user_id"
              label="代理uid"
              width="180">
            </el-table-column>
            <el-table-column
              prop="parent_wx_id"
              label="代理微信id"
              width="180">
            </el-table-column>
            <el-table-column
              prop="wx_nick_name"
              label="代理微信昵称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="pdd_pid"
              label="分配pid"
              width="180">
            </el-table-column>
            <el-table-column
              prop="level0_income"
              label="自购/推广所得"
              width="180">
            </el-table-column>
            <el-table-column
              prop="level1_income"
              label="作为上级代理所得">
            </el-table-column>
            <el-table-column
              prop="level2_income"
              label="作为上上级代理所得">
            </el-table-column>
            <el-table-column
              prop="total_income"
              label="总计所得">
            </el-table-column>
          </el-table>
        </div>
        <div class="page-content">
          <el-pagination
            class="page-content-div"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listData.page"
            :page-size="listData.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="listData.total">
          </el-pagination>
        </div>
      </el-card>
    </div>
</template>
<script>
import {getSalary} from '@server/salaryCenter/index.js';
export default {
  name: 'HelloWorld',
  data () {
    return {
      form: {
        date: '',
        page: 1
      },
      listData: {
        total: 0,
        count: 0,
        page: 1,
        pageSize: 100,
        data: []
      },
      currentPage4: 4
    };
  },
  methods: {
    onSubmit () {
      this.form.page = 1;
      this.getData();
    },
    getData () {
      let params = JSON.parse(JSON.stringify(this.form));
      console.log(this.form);
      getSalary(params).then(({data, code, msg}) => {
        if (code === 200) {
          this.listData = data;
        } else {
          this.$message({
            message: msg,
            type: 'warning'
          });
        }
      });
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.form.page = val;
      this.getData();
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getData();
    });
  }
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style lang="less">
  .saray{
    .page-content{
      text-align: center;
    }
    .page-content-div{
      text-align: center;
    }
  }
</style>
