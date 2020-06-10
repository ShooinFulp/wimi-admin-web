<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.vo.name"
        placeholder="广告名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>-->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="180"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告链接" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片路径" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.photoUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="430"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="广告名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="广告链接" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" />
        </el-form-item>
        <el-form-item label="广告位置" prop="position">
          <el-select v-model="temp.position" class="filter-item" placeholder="请选择">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" prop="name">
          <el-upload
            class="upload-demo"
            action="http://imvc.xyz:9019/file_center/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            list-type="picture"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createAdvertisement,
  deleteAdvertisement,
  updateAdvertisement
} from "@/api/advertisement";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "Carousel", display_name: "首页轮播图" },
  { key: "About", display_name: "关于页面" },
  { key: "Detail", display_name: "详情页" },
  { key: "StartUp", display_name: "启动展示图" }
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        vo: {
          name: undefined
        }
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["编辑", "删除"],
      showReviewer: false,
      temp: {
        id: undefined,
        name: "",
        url: "",
        position: "",
        photoUrl: "",
        sort: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑广告",
        create: "添加广告"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [
          { required: true, message: "广告名称必须输入", trigger: "blur" }
        ],
        url: [{ required: true, message: "广告地址必须输入", trigger: "blur" }],
        sort: [{ required: true, message: "排序", trigger: "blur" }],
        position: [
          { required: true, message: "请选择广告位置", trigger: "change" }
        ]
      },
      downloadLoading: false,
      fileList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    uploadError(err, file, fileList){
        console.log(err);
        
    },
    uploadSuccess(response, file, fileList){
      console.log("uploadSuccess",response);
      this.fileList.push(response.data.filePath)
    },
    handleRemove(file, fileList) {
      console.log("handleRemove",file, fileList);
    },
    handlePreview(file) {
      console.log("handlePreview",file);
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        console.log(response);

        this.list = response.rows;
        this.total = response.rowTotal;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList(this.listQuery);
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        url: "",
        position: "",
        photoUrl: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createAdvertisement(this.temp).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功！",
              message: "添加成功！",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateAdvertisement(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功！",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      const parmas = { id: row.id };
      deleteAdvertisement(parmas).then(res => {
        if (res.code != 0) {
          this.$notify({
            title: "失败",
            message: res.message,
            type: "error",
            duration: 2000
          });
        } else {
          this.$notify({
            title: "成功",
            message: "删除成功！",
            type: "success",
            duration: 2000
          });
          this.list.splice(index, 1);
        }
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    }
  }
};
</script>
