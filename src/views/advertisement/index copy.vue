<template>
  <div class="advertisement">
    <el-container>
      <el-header height="120px">
        <div class="action">
          <el-button icon="el-icon-plus">新增</el-button>
          <el-button icon="el-icon-search">查询</el-button>
        </div>
        <div>
          <div>
            <el-form ref="form" :model="form" label-width="55px">
            <!-- <el-input prepend="hahha" placeholder="请输入内容" v-model="name" clearable></el-input> -->
            <el-form-item label="名称：" class="form-item">
              <el-input v-model="form.name" />
            </el-form-item>
            </el-form>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed prop="id" label="日期" width="150"></el-table-column>
          <el-table-column fixed prop="name" label="名称" width="120"></el-table-column>
          <el-table-column fixed prop="province" label="位置" width="120"></el-table-column>
          <el-table-column prop="sort" label="排序" width="120"></el-table-column>
          <el-table-column prop="url" label="广告链接" width="300"></el-table-column>
          <el-table-column prop="photoUrl" label="图片地址" width="120"></el-table-column>
          <el-table-column prop="createdBy" label="创建人" width="120"></el-table-column>
          <el-table-column prop="creationDate" label="创建时间" width="120"></el-table-column>
          <el-table-column prop="updatedBy" label="更新人" width="120"></el-table-column>
          <el-table-column prop="updationDate" label="更新时间" width="120"></el-table-column>
          <el-table-column fixed prop="enabledFlag" label="是否启用" width="120"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>                      
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: ""                                    
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333
        }
      ]
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
    }
  }
};
</script>

<style lang="scss" scoped>
.advertisement {
  margin: 30px;
}
.serach,
.action {
  margin-bottom: 30px;
}

.form-item{
  width: 300px;
}
</style>
