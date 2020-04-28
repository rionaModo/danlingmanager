<template>
    <div class="saray">
      <dl-page-title :breadcrumb="breadcrumb">
      </dl-page-title>
      <dl-main-container>
          <el-form ref="form" :model="form" label-width="200px">
            <el-row>
              <el-col :span="7" :offset="2">
                  <el-form-item :required="true" label="活动名称:">
                    <el-input v-model="form.subject" type="textarea" placeholder="请输入活动名称/主题"  :maxlength="50" show-word-limit></el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7" :offset="2">
                <el-form-item label="活动开始时间:">
                  <el-date-picker
                      format="yyyy-MM-DD"
                      value-format="yyyyMMDD"
                      v-model="form.date"
                      type="month"
                      placeholder="请确认活动开始时间">
                    </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7" :offset="2">
                <el-form-item label="活动地点:">
                    <el-input placeholder="请输入活动地点" type="textarea" show-word-limit :maxlength="100"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7" :offset="2">
                <el-form-item label="活动预计耗时:">
                  <el-input-number placeholder="请输入活动预计耗时"  v-model="num" controls-position="right"  :min="1"></el-input-number>小时
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7" :offset="2">
                <el-form-item label="活动参与人数:">
                  <el-input-number placeholder="请输入活动预计耗时" v-model="num" controls-position="right"  :min="1"></el-input-number>人
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7" :offset="2">
                <el-form-item label="活动积分:">
                  <el-input-number placeholder="请设置活动积分" v-model="num" controls-position="right"  :min="1"></el-input-number>分
                  <p>共计需要积分{ 人数 * 耗时 }</p>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7" :offset="2">
                <el-form-item label="报名截止日期:">
                  <el-date-picker
                      format="yyyy-MM-DD"
                      value-format="yyyyMMDD"
                      v-model="form.date"
                      type="month"
                      placeholder="设置报名截止日期">
                    </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="7" :offset="2">
                  <el-form-item label="活动详情:">
                    xxx
                  </el-form-item>
                </el-col>
              </el-row>
          </el-form>
      </dl-main-container>
    </div>
</template>
<script>
import {getSalary} from '@server/salaryCenter/index.js';
export default {
  name: 'activityAdd',
  data () {
    return {
      breadcrumb: ['活动管理', '新增活动'],
      form: {
        subject: '',
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
