<template>
  <div class="mg">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="菜单名称">
        <el-input v-model="queryParams.menuName" placeholder="菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单URL">
        <el-input v-model="queryParams.menuUrl" placeholder="菜单URL"></el-input>
      </el-form-item>
      <el-form-item label="权限类型">
        <el-select v-model="queryParams.type" placeholder="权限类型">
          <el-option label="请选择" value></el-option>
          <el-option label="菜单" value="menu"></el-option>
          <el-option label="按钮" value="button"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMenuList">查询</el-button>
        <el-button type="primary" @click="handleEdit('', 'insert')">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="menuInfList" :stripe="true" class="width100">
      <el-table-column label="菜单名称" prop="menuName"></el-table-column>
      <el-table-column label="菜单URL" prop="menuUrl"></el-table-column>
      <el-table-column label="权限标识" prop="permission"></el-table-column>
      <el-table-column label="菜单图标" prop="menuIcon"></el-table-column>
      <el-table-column label="权限类型">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.type == 'menu'">菜单</el-tag>
          <el-tag effect="dark" type="danger" v-else-if="scope.row.type == 'button'">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row, 'edit')">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页    -->
    <pagination v-show="totalSize>0" :total="totalSize" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getMenuList"/>

    <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="40%">
      <el-form :model="userInfoFrom" :rules="ruleUserInfoFrom" ref="userInfoFrom" size="small" label-width="auto" class="demo-ruleForm">
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="userInfoFrom.userAccount"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="userInfoFrom.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userInfoFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-select v-model="userInfoFrom.deptName" placeholder="请选择部门">
            <el-option :label="item.deptName" :value="item.deptName" v-for="item in deptOptions"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="userInfoFrom.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfoFrom.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllMenuList, insertMenu, updateMenu, deleteMenu } from "../../api/menu";
  import Pagination from "../../components/Pagination";
  export default {
    name: "menuList",
    components: { Pagination },
    data() {
      return {
        queryParams: {
          menuName: "", // 菜单名称
          menuUrl: "", // 菜单url
          pageNum: 1, // 当前页
          pageSize: 10, // 每页显示数量
          type: "", // 类型 menu:菜单  button:按钮
        }, // 查询条件
        userInfoFrom: {
          deptId: "", // 部门id
          deptName: "", // 部门名称
          email: "", // 邮箱
          phoneNumber: "", // 手机号
          userAccount: "", // 用户账号
          userName: "", // 用户名称
          password: "", // 密码
          userId: '', // 用户id
        }, // 用户信息
        ruleUserInfoFrom: {
          userAccount: [{ required: true, message: '请填写用户账号', trigger: 'change' }],
          userName: [{ required: true, message: '请填写用户名称', trigger: 'change' }],
          password: [{ required: true, message: '请填写密码', trigger: 'change' }],
          deptName: [{ required: true, message: '请选择部门', trigger: 'change' }],
          phoneNumber: [{ required: false, message: '请填写手机号', trigger: 'change' },
            {min:11, max: 11}],
          email: [{ required: false, message: '请填写邮箱', trigger: 'change' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        }, // 校验表单
        menuInfList: [], // 菜单列表
        totalSize: 0, // 总行数
        dialogVisible: false,// 新增/编辑弹窗是否显示
        dialogTitle: '新增用户', // 弹窗标题
        dialogType: '', // 弹窗操作类型
        deptOptions: [
          {deptId: '', deptName: '请选择'},
          {deptId: 1, deptName: '软件部'},
          {deptId: 2, deptName: '财务部'},
          {deptId: 3, deptName: '业务部'},
          {deptId: 4, deptName: '市场部'},
          {deptId: 5, deptName: '行政部'},
        ]
      };
    },
    created() {
      this.getMenuList();
    },
    methods: {
      getMenuList() {
        getAllMenuList(this.queryParams)
                .then(res => {
                  console.log("菜单列表", res);
                  if (res.result == "success") {
                    this.menuInfList = res.data;
                    // 总行数
                    this.totalSize = res.totalRows;
                    // 当前页
                    this.queryParams.pageNum = res.pageNum;
                    // 每页行数
                    this.queryParams.pageSize = res.pageSize;
                  } else {
                    this.$notify({
                      type: "error",
                      message: res.message
                    });
                  }
                })
                .catch(err => {
                  console.log("查询菜单信息出错", err);
                });
      },
      // 编辑用户信息初始化
      handleEdit(row, type) {
        if (type == 'edit') {
          this.userInfoFrom = {...row};
          this.dialogTitle = '编辑用户';
          this.dialogType = 'edit';
        } else {
          this.dialogTitle = '新增用户';
          this.dialogType = 'insert';
        }
        this.dialogVisible = true;
      },
      // 编辑用户信息提交
      handleEditSubmit() {
        this.$refs['userInfoFrom'].validate((valid) => {
          if (valid) {
            this.userInfoFrom = {
              ...this.userInfoFrom,
              deptId: this.deptOptions.find(item => {if (item.deptName == this.userInfoFrom.deptName) return item}).deptId
            };
            if (this.dialogType == 'edit') {
              updateUser(this.userInfoFrom).then(res => {
                if (res.result == 'success') {
                  this.$notify({type: 'success', message: '修改成功'});
                  this.dialogVisible = false;
                  this.getUserList();
                } else {
                  this.$notify({type:'error', message: res.message});
                }
              })
            } else {
              insertUser(this.userInfoFrom).then(res => {
                if (res.result == 'success') {
                  this.$notify({type: 'success', message: '添加成功'});
                  this.dialogVisible = false;
                  this.getUserList();
                } else {
                  this.$notify({type:'error', message: res.message});
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 删除菜单信息
      handleDelete(row) {
        this.$confirm("请确认是否删除菜单信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }) .then(() => {
          deleteMenu({menuId:row.menuId}).then(res => {
            if (res.result == 'success') {
              this.$notify({type:'success', message:'删除成功'})
              this.getMenuList();
            } else {
              this.$notify({type:'error', message: res.message})
            }
          })
        }).catch(()=>{});
      }
    }
  };
</script>

<style scoped>
</style>